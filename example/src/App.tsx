import { useState } from 'react';
import {
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ConnectXMobileSdk } from 'connect-x-react-native-sdk';

// ponytail: the SDK reports HTTP results only via console (cx* resolve true even on 4xx), so capture it
const logs: string[] = [];
(['log', 'error'] as const).forEach((level) => {
  const original = console[level];
  console[level] = (...args: unknown[]) => {
    original(...args);
    logs.push(args.map(show).join(' '));
  };
});

function show(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value); // circular, e.g. XMLHttpRequest
  }
}

const fns: Record<
  string,
  {
    template: unknown;
    run: (payload: any, objectName: string) => Promise<unknown>;
  }
> = {
  cxTracking: {
    template: { cx_event: 'test_event', cx_source: 'rn-tracking-test' },
    run: (p) => ConnectXMobileSdk.cxTracking(p),
  },
  cxIdentify: {
    template: {
      key: 'cx_email',
      customers: {
        cx_Name: 'customerName',
        cx_firstName: 'customerFirstName',
        cx_mobilePhone: '0000000000',
        cx_email: 'customerEmail',
      },
      tracking: {
        cx_value: '',
        cx_tag: ['Keyword1', 'Keyword2', 'Keyword3'],
        cx_prospect: true,
      },
      form: { cx_subject: 'mobile', cx_desc: 'mobile' },
      options: {
        updateCustomer: false,
        customs: [
          { customObjectA: { cx_Name: 'Keyword' } },
          { customObjectB: { cx_Name: 'Keyword' } },
        ],
        updateSomeFields: { bmi: 25, weight: 55 },
      },
    },
    run: (p) => ConnectXMobileSdk.cxIdentify(p),
  },
  cxOpenTicket: {
    template: {
      key: 'cx_Name',
      customers: {
        cx_Name: 'customerName',
        cx_firstName: 'customerFirstName',
        cx_phone: 'customerPhone',
        cx_mobilePhone: 'customerMobilePhone',
        cx_email: 'customerEmail',
      },
      ticket: {
        cx_subject: 'test subject',
        cx_socialAccountName: 'xxxx@hotmail.com',
        cx_socialContact: 'xxxx@hotmail.com',
        cx_channel: 'email',
        email: { text: 'text', html: '<b>Content</b>' },
      },
      lead: { cx_email: 'xxxx@hotmail.com', cx_channel: 'test_connect_email' },
      customs: [
        { customObjectA: { cx_Name: 'Test' } },
        { customObjectB: { cx_Name: 'Test' } },
      ],
    },
    run: (p) => ConnectXMobileSdk.cxOpenTicket(p),
  },
  cxCreateRecords: {
    // docId: null = create, ใส่ id = edit (สูงสุด 200 แถว)
    template: [
      {
        attributes: { referenceId: 'UNIQUE_ID' },
        cx_Name: 'cxName',
        docId: null,
      },
    ],
    run: (p, objectName) => ConnectXMobileSdk.cxCreateRecords(objectName, p),
  },
  getUnknownId: {
    template: null,
    run: () => ConnectXMobileSdk.getUnknownId(),
  },
};

// props come from launch intent extras (see MainActivity.kt)
export default function App(props: {
  org?: string;
  token?: string;
  env?: string;
}) {
  const [org, setOrg] = useState(props.org ?? '');
  const [token, setToken] = useState(props.token ?? '');
  const [env, setEnv] = useState(props.env ?? '');
  const [ready, setReady] = useState(false);
  const [fnName, setFnName] = useState('cxTracking');
  const [payload, setPayload] = useState(show(fns.cxTracking!.template));
  const [objectName, setObjectName] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string }>();

  const run = async (name: string, call: () => Promise<unknown>) => {
    setBusy(true);
    logs.length = 0;
    const started = Date.now();
    let ok = true;
    let value: unknown;
    try {
      value = await call();
    } catch (e) {
      ok = false;
      value = e;
    }
    // ponytail: keys off the SDK's log wording; drop once cxPost throws or returns the response
    if (logs.some((l) => /^(Status:|No response:|Error:|Failed to)/.test(l))) {
      ok = false;
    }
    const ms = Date.now() - started;
    const head = `${ok ? '✅' : '❌'} ${name} · ${ms}ms`;
    setResult({
      ok,
      text: `${head}\nreturned: ${show(value)}\n\n${logs.join('\n')}`,
    });
    setBusy(false);
    return ok;
  };

  const confirm = async () =>
    setReady(
      await run('initialize', () =>
        // arg order is (token, organizeId), not (org, token)
        ConnectXMobileSdk.initialize(
          token.trim(),
          org.trim(),
          env.trim() || undefined
        )
      )
    );

  const pick = (name: string) => {
    setFnName(name);
    setPayload(show(fns[name]!.template));
  };

  const submit = () =>
    run(fnName, () => fns[fnName]!.run(JSON.parse(payload), objectName.trim()));

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    hint = ''
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={hint}
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>ConnectX Tracking Tester</Text>
      <Text style={styles.hint}>
        ทดสอบทุก function ของ connect-x-react-native-sdk
      </Text>

      {field('Organize ID', org, setOrg)}
      {field(
        'API Token',
        token,
        setToken,
        'วาง token จาก Organization Settings → SDK Tracking'
      )}
      {field(
        'Env (optional)',
        env,
        setEnv,
        'เช่น dev, uat — เว้นว่าง = production'
      )}
      <Text style={styles.hint}>
        → https://backend{env.trim() && `-${env.trim()}`}.connect-x.tech
        (สลับกลับ production ต้องปิดแอพเปิดใหม่)
      </Text>
      <Button title="Confirm (initialize)" onPress={confirm} disabled={busy} />

      {ready && (
        <>
          <View style={styles.chips}>
            {Object.keys(fns).map((name) => (
              <Pressable
                key={name}
                onPress={() => pick(name)}
                style={[styles.chip, name === fnName && styles.chipOn]}
              >
                <Text
                  style={[
                    styles.chipText,
                    name === fnName && styles.chipTextOn,
                  ]}
                >
                  {name}
                </Text>
              </Pressable>
            ))}
          </View>
          {fnName === 'cxCreateRecords' &&
            field(
              'objectName',
              objectName,
              setObjectName,
              'เช่น cx_Custom_Object'
            )}
          {fns[fnName]!.template !== null && (
            <>
              <Text style={styles.label}>Payload (JSON)</Text>
              <TextInput
                style={[styles.input, styles.editor]}
                value={payload}
                onChangeText={setPayload}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </>
          )}
          <Button
            title={busy ? 'กำลังส่ง…' : `Submit ${fnName}`}
            onPress={submit}
            disabled={busy}
          />
        </>
      )}

      {result && (
        <Text
          selectable
          style={[styles.result, !result.ok && styles.resultFail]}
        >
          {result.text}
        </Text>
      )}
    </ScrollView>
  );
}

const mono = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7f7' },
  content: { padding: 16, paddingTop: 48, gap: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#0e7f7f' },
  label: { marginTop: 8, fontWeight: '600', color: '#222' },
  hint: { fontSize: 12, color: '#777' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    color: '#111',
    backgroundColor: '#fff',
  },
  editor: {
    height: 260,
    fontFamily: mono,
    fontSize: 12,
    textAlignVertical: 'top',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e2eaea',
  },
  chipOn: { backgroundColor: '#0e9f9f' },
  chipText: { fontFamily: mono, fontSize: 12, color: '#222' },
  chipTextOn: { color: '#fff' },
  result: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    fontFamily: mono,
    fontSize: 12,
    color: '#111',
  },
  resultFail: { backgroundColor: '#fdecea' },
});
