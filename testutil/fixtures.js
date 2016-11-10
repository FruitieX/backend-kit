import fixtureFactory from 'fixture-factory';
import _ from 'lodash';

fixtureFactory.register('employee', {
  createdAt: 'date.recent',
  id: 'random.number',
  name: (fixtures, options, dataModel, faker) => (
    `${faker.name.firstName()} ${faker.name.lastName()}`
  ),
  password: 'internet.password', // TODO: not hashed
  email: 'internet.email',
  verified: true,
});

export function renameKeys(object, dict) {
  return _.mapKeys(object, (value, key) => (
    dict[key] ? dict[key] : key
  ));
}

export default fixtureFactory;
