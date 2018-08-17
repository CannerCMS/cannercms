// @flow
import * as React from 'react';
import {Item} from 'canner-helpers';

type Props = {
  renderChildren: {[string]: any} => React$Node,
  id: string,
  title: string,
  description: string,
  name: string,
  routes: Array<string>,
  // navigate is given by layer3Fieldset,
  // decide this row should navigate other pages or become a input directly
  // for now: when type is object or array, the navigate will be true
  navigate: boolean,
  goTo: string => void
};

type State = {
  collapsed: boolean
};

export default class Row extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  edit = () => {
    const {navigate, goTo, id, name} = this.props;
    if (navigate) {
      goTo(`/${id}/${name}`);
    } else {
      this.setState({
        collapsed: !this.state.collapsed
      });
    }
  }

  render() {
    const {renderChildren, title, description, id, name, routes, navigate} = this.props;
    const {collapsed} = this.state;
    const rowStyle = {
      width: '100%',
      display: 'flex',
      padding: '8px 0',
      borderBottom: '1px solid #eee',
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    const titleStyle = {
      width: 100
    };

    const descriptionStyle = {
      color: '#aaa',
      flex: 1
    };

    const inputStyle = {
      marginRight: 24
    };

    const actionStyle = {
      width: 60
    };

    if (routes[0] === name) {
      return <div>
        {renderChildren({id, routes, hideTitle: true})}
      </div>;
    }

    return <div>
      <div style={rowStyle}>
        <div style={titleStyle}>
          <h4>{title}</h4>
        </div>
        <div style={descriptionStyle}>
          {description}
        </div>
        {
          navigate ?
            null :
            <div style={inputStyle}>
              <Item hideTitle readOnly={collapsed}/>
            </div>
        }
        <div style={actionStyle}>
          <span onClick={this.edit}>
            <a>
              {
                collapsed ?
                  'edit' :
                  'done'
              }
            </a>
          </span>
        </div>
      </div>
    </div>;
  }
}
