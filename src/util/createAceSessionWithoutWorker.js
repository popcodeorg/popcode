import ACE from 'brace';

export default function createAceSessionWithoutWorker(language, source = '') {
  const session = ACE.createEditSession(source, null);
  session.setUseWorker(false);
  session.setMode(`ace/mode/${language}`);
  return session;
}
