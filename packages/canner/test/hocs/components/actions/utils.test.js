import {flattenItems} from '../../../../src/hocs/components/actions/utils';

describe('flatten items', () => {
  const items = {
    posts: {
      keyName: 'posts',
      type: 'array',
      items: {
        type: 'object',
        items: {
          title: {
            type: 'string',
            keyName: 'title'
          },
          images: {
            keyName: 'images',
            type: 'array',
            items: {
              type: 'object',
              items: {
                url: {
                  keyName: 'url'
                }
              }
            }
          }
        }
      }
    }
  };

  it('should return 2 fields', () => {
    const result = flattenItems(items);
    expect(result[0]).toMatchObject({
      keyName: 'posts.title',
      type: 'string'
    });
    expect(result[1]).toMatchObject({
      keyName: 'posts.images.url'
    })
  });
});
