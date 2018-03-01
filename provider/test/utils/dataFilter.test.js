import DataFilter from '../../src/utils/dataFilter';
import {fromJS} from 'immutable';

const schema = {
  d: {
    type: 'array',
    filterKey: 'model',
    items: {
      type: 'object'
    }
  }
};

const CannerJSON = fromJS({
  d: [
    {model: 'model1'},
    {model: 'model2'},
    {category: 'category1'},
    {model: 'model3'},
    {category: 'category2'},
    {category: 'category3'}
  ]
});

const filteredData = new DataFilter(schema)
                          .filterCannerJSON(CannerJSON);

describe('datafilter', function() {
  it('should filter cannerJSON', function() {
    expect(filteredData.toJS()).toEqual({d: [
      {model: 'model1'},
      {model: 'model2'},
      {model: 'model3'}
    ]});
  });
});

