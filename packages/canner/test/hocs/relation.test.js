import {removeSelf} from '../../src/hocs/relation';
import RefId from 'canner-ref-id';

describe('removeSelf', () => {
  it('should remove id2 node', () => {
    const connectionData = {
      edges: [1, 2, 3].map(v => (
        {
          cursor: 'id' + v,
          node: {
            id: 'id' + v
          }
        }
      ))
    };
    const refId = new RefId('posts/1/relation');
    expect(removeSelf(connectionData, refId, 'posts')).toEqual({
      edges: [{
        cursor: 'id1',
        node: {
          id: 'id1'
        }
      }, {
        cursor: 'id3',
        node: {
          id: 'id3'
        }
      }]
    });
  });

  it('should not remove any node', () => {
    const connectionData = {
      edges: [1, 2, 3].map(v => (
        {
          cursor: 'id' + v,
          node: {
            id: 'id' + v
          }
        }
      ))
    };
    const refId = new RefId('posts/1/relation');
    expect(removeSelf(connectionData, refId, 'users')).toEqual({
      edges: [1, 2, 3].map(v => (
        {
          cursor: 'id' + v,
          node: {
            id: 'id' + v
          }
        }
      ))
    });
  });
});

