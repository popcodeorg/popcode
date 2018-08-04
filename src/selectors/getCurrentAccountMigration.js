export default function getCurrentAccountMigration(state) {
  return state.getIn(['user', 'currentMigration']);
}
