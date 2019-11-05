import { serverUrl } from './consts.js';
import React from 'react';
import { Link } from 'react-router-dom';

export default class BookList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch(`${serverUrl}books?select=id,title,authors(id,name)&order=id`)
      .then(response => response.json())
      .then(data => this.setState({ items: data }));
  }

  render() {
    if (this.state) {
      return (<div>
            <div><Link to={'/'}>Back to Home</Link></div>
            <div><Link to={'/book/new'}>New Book</Link></div>
            <div className="row">
              <div className="col-sm-6">
                <table className="table">
                  <tbody>
                  <tr><th>Title</th><th>Author</th></tr>
                  {this.state.items.map(s => <tr key={s.id}>
                      <td><Link to={`book/${s.id}`}>{s.title}</Link></td>
                      <td>{s.authors.name}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>);
    }
    else {
      return null;
    }
  }
}
