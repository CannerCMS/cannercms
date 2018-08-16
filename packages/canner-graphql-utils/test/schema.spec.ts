// tslint:disable:no-unused-expression
import { Types } from '../src/schema/types';
import { field as rootField } from './constants';
import * as chai from 'chai';
const expect = chai.expect;

describe('schema', () => {
  it('should visit array scalar field', () => {
    const idField = rootField.posts.getChild('id');
    const titleField = rootField.posts.getChild('title');
    expect(rootField.posts.hasChild()).to.be.eql(true);
    expect(idField.getType()).to.eql(Types.ID);
    expect(titleField.getType()).to.eql(Types.STRING);
  });

  it('should visit array relation field', () => {
    const field = rootField.users.getChild('posts');
    expect(field.getType()).to.eql(Types.RELATION);
    expect(field.hasChild()).to.be.eql(true);
    expect(field.getChild('id').getType()).to.eql(Types.ID);
    expect(field.getChild('title').getType()).to.eql(Types.STRING);
  });

  it('should visit array toMany', () => {
    const field = rootField.posts.getChild('author');
    expect(field.getType()).to.eql(Types.RELATION);
    expect(field.hasChild()).to.be.eql(true);
    expect(field.getChild('id').getType()).to.eql(Types.ID);
    expect(field.getChild('age').getType()).to.eql(Types.INT);
  });

  it('should visit array nested array field', () => {
    const field = rootField.posts.getChild('notes');
    expect(field.hasChild()).to.be.eql(true);
    expect(field.getType()).to.eql(Types.ARRAY);
    expect(field.getChild('text').getType()).to.eql(Types.STRING);
  });

  it('should visit array two-level nested relation', () => {
    const field = rootField.posts.getChild('author');
    expect(field.getType()).to.eql(Types.RELATION);
    expect(field.getChild('posts').getChild('id').getType()).to.eql(Types.ID);
    expect(field.getChild('posts').hasChild()).to.eql(true);
  });

  it('should visit nullField without throwing', () => {
    const field = rootField.posts.getChild('notExist');
    expect(field.getType()).to.be.null;
    expect(field.hasChild()).to.be.eql(false);
    expect(field.getChild('x').getType()).to.be.null;
    expect(field.getChild('x').getChild('y').getType()).to.be.null;
  });

  /**
   * object
   */
  it('should visit object field', () => {
    const field = rootField.home;
    expect(field.getType()).to.eql(Types.OBJECT);
    expect(field.hasChild()).to.eql(true);
    expect(field.getChild('count').getType()).to.eql(Types.INT);

    // nested object
    expect(field.getChild('header').getType()).to.eql(Types.OBJECT);
    expect(field.getChild('header').hasChild()).to.eql(true);
    expect(field.getChild('header').getChild('title').getType()).to.eql(Types.STRING);
    expect(field.getChild('header').getChild('subTitle').getType()).to.eql(Types.STRING);

    // nested array-of-object
    expect(field.getChild('navs').getType()).to.eql(Types.ARRAY);
    expect(field.getChild('navs').hasChild()).to.eql(true);
    expect(field.getChild('navs').getChild('text').getType()).to.eql(Types.STRING);

    // toOne
    expect(field.getChild('staredPosts').getChild('id').getType()).to.eql(Types.ID);
    expect(field.getChild('staredPosts').hasChild()).to.eql(true);
    expect(field.getChild('staredPosts').getChild('title').getType()).to.eql(Types.STRING);

    // toMany
    expect(field.getChild('bestAuthor').getChild('name').getType()).to.eql(Types.STRING);
    expect(field.getChild('bestAuthor').hasChild()).to.eql(true);
    expect(field.getChild('bestAuthor').getChild('email').getType()).to.eql(Types.STRING);
  });
});
