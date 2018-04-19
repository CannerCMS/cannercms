import {App} from '../src/app';

describe('app', () => {
  it('should be return context finally', () => {
    const app = new App();
    app.use({handleChange: function(ctx, next) {
      ctx.body = {test: 'good'};
      return next();
    }});
    app.handleChange({
      request: {
        type: 'hi',
      },
    }).then((ctx) => {
      expect(ctx.body).toEqual({test: 'good'});
    });
  });

  it('middleware next worked', () => {
    const app = new App();
    const newData = {test: 'new'};
    const oldData = {test: 'old'};
    app.use({handleChange: function(ctx, next) {
      ctx.body = oldData;
      return next();
    }});
    app.use({handleChange: function(ctx, next) {
      expect(ctx.body).toEqual(oldData);
      ctx.body = newData;
      return next();
    }});
    app.handleChange({
      request: {
        type: '',
        key: ''
      }
    }).then((ctx) => {
        expect(ctx.body).toEqual(newData);
      });
  });

  it('middleware can get next().then', () => {
    const app = new App();
    const newData = {test: 'new'};
    const oldData = {test: 'old'};
    app.use({handleChange: function(ctx, next) {
      ctx.body = oldData;
      return next().then((data) => {
        ctx.body = data;
      });
    }});
    app.use({handleChange: function(ctx) {
      expect(ctx.body).toEqual(oldData);
      return Promise.resolve(newData);
    }});
    app.handleChange({
      request: {
        type: '',
        key: ''
      }
    }).then((ctx) => {
        expect(ctx.body).toEqual(newData);
      });
  });
});
