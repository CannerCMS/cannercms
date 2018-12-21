import Validator from '../../src';
import pick from 'lodash/pick';

describe('relation', () => {
  test('relation only can be second level', () => {
    const validator = new Validator({
      type: 'relation',
      path: 'post/test/relation',
      ui: 'singleSelect',
      relation: {
        type: 'toOne',
        to: 'any'
      },
      uiParams: {
        textCol: 'title',
        columns: [{
          title: 'title',
          dataIndex: 'title'
        }] 
      }
    });
    expect(validator.validate()).toBe(false);
  });
})

describe('relation singleSelect', () => {
  const schema = {
    type: 'relation',
    ui: 'singleSelect',
    relation: {
      type: 'toOne',
      to: 'any'
    },
    uiParams: {
      textCol: 'title',
      columns: [{
        title: 'title',
        dataIndex: 'title'
      }] 
    }
  }
  it('should be invalid with no other fields', () => {
    const validator = new Validator(pick(schema, ['type', 'ui']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no relation', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'uiParams']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation']));
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with toMany relation', () => {
    const validator = new Validator({
      ...schema,
      relation: {
        to: 'any',
        type: 'toMany'
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with relation and uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation', 'uiParams']));
    expect(validator.validate()).toBe(true);
  });
});

describe('relation multipleSelect', () => {
  const schema = {
    type: 'relation',
    ui: 'multipleSelect',
    relation: {
      type: 'toMany',
      to: 'any'
    },
    uiParams: {
      columns: [{
        title: 'title',
        dataIndex: 'title'
      }] 
    }
  }
  it('should be invalid with no other fields', () => {
    const validator = new Validator(pick(schema, ['type', 'ui']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no relation', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'uiParams']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation']));
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with toOne relation', () => {
    const validator = new Validator({
      ...pick(schema, ['type', 'ui', 'relation', 'uiParams']),
      relation: {
        type: 'toOne',
        to: 'any'
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with relation and uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation', 'uiParams']));
    expect(validator.validate()).toBe(true);
  });
});

describe('relation singleSelectTree', () => {
  const schema = {
    type: 'relation',
    ui: 'singleSelectTree',
    relation: {
      type: 'toOne',
      to: 'any'
    },
    uiParams: {
      textCol: 'title',
      relationField: 'any',
      disabled: function() {}
    }
  }
  it('should be invalid with no other fields', () => {
    const validator = new Validator(pick(schema, ['type', 'ui']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no relation', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'uiParams']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation']));
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with toMany relation', () => {
    const validator = new Validator({
      ...schema,
      relation: {
        to: 'any',
        type: 'toMany'
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no relationField columns', () => {
    const validator = new Validator({
      ...schema,
      uiParams: {
        textCol: ''
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with relation and uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation', 'uiParams']));
    expect(validator.validate()).toBe(true);
  });
});

describe('relation multipleSelectTree', () => {
  const schema = {
    type: 'relation',
    ui: 'multipleSelectTree',
    relation: {
      type: 'toMany',
      to: 'any'
    },
    uiParams: {
      textCol: 'string',
      relationField: 'any',
      disabled: function() {}
    }
  }
  it('should be invalid with no other fields', () => {
    const validator = new Validator(pick(schema, ['type', 'ui']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no relation', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'uiParams']));
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation']));
    expect(validator.validate()).toBe(false);
  });
  
  it('should be invalid with toOne relation', () => {
    const validator = new Validator({
      ...pick(schema, ['type', 'ui', 'relation', 'uiParams']),
      relation: {
        type: 'toOne',
        to: 'any'
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be invalid with no relationField in uiParams', () => {
    const validator = new Validator({
      ...schema,
      uiParams: {
        textCol: 'any',
      }
    });
    expect(validator.validate()).toBe(false);
  });

  it('should be valid with relation and uiParams', () => {
    const validator = new Validator(pick(schema, ['type', 'ui', 'relation', 'uiParams']));
    expect(validator.validate()).toBe(true);
  });
});