import { serverUrl } from './consts.js';
import React from 'react';

export default class BookInfoBase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch(`${serverUrl}books?id=eq.${this.props.match.params.bookId}&select=*,authors(*)`, {
      headers: new Headers({ Accept: 'application/vnd.pgrst.object+json' })
      })
      .then(resp => resp.json())
      .then(data => this.setState(data));
  }
}

