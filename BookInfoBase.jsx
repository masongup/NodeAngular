const { serverUrl } = require('./consts.js');
const React = require('react');

module.exports = class BookInfoBase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch(`${serverUrl}books?id=eq.${this.props.params.bookId}&select=*,authors{*}`, {
      headers: new Headers({ Accept: 'application/vnd.pgrst.object+json' })
      })
      .then(resp => resp.json())
      .then(data => this.setState(data));
  }
}

