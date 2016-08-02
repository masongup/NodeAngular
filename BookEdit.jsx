const React = require('react');
const { serverUrl } = require('./consts.js');
const BookInfoBase = require('./BookInfoBase.jsx');
const { Link, withRouter } = require('react-router');
const AutoSuggest = require('react-autosuggest');
const { connect } = require('react-redux');

class BookEditBase extends BookInfoBase {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAuthor = this.changeAuthor.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.state = { authors: { name: '' }, suggestions: [], title: '' };
  }

  componentDidMount() {
    const stateObj = { suggestions: [ { name: 'test' }] };
    if (this.props.params.bookId) {
      super.componentDidMount();
    }
    else {
      stateObj.authors = { name: '', title: '' };
    }
    this.setState(stateObj);
  }

  changeTitle(event) {
    this.setState({ title: event.target.value });
  }
  changeAuthor(e) {
    this.setState({ authors: { name: e.target.value } });
  }
  changeDescription(e) {
    this.setState({ description: e.target.value });
  }

  submitForm(e) {
    e.preventDefault();
    //this.state.author_id = this.state.authors.id;
    this.state.author_id = 3;
    delete(this.state.authors);
    const fetchOptions = {
      body: JSON.stringify(this.state),
      headers: new Headers({ 
        'Authorization': `Bearer ${this.state.token}`,
        'Content-Type': 'application/json' 
      })
    };
    if (this.props.params.bookId) {
      fetchOptions.method = 'PATCH';
      fetch(`${serverUrl}books?id=eq.${this.props.params.bookId}`, fetchOptions)
        .then(r => this.props.router.push(`/book/${this.state.id}`));
    }
    else {
      fetchOptions.method = 'POST';
      fetch(`${serverUrl}books`, fetchOptions)
        .then(resp => {
          const newId = /\d+$/.exec(resp.headers.get('Location'))[0];
          this.props.router.push(`/book/${newId}`);
        });
    }
  }

  onSuggestionsUpdateRequested({ value, reason }) {
    if (reason === 'type') {
      fetch(`${serverUrl}authors?name=like.${value}*&order=name`, {
            headers: new Headers({ Range: '0-50' })
          })
        .then(resp => resp.json())
        .then(respJ => this.setState({ suggestions: respJ }));
    }
  }

  getSuggestionValue(suggestion) {
    debugger;
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    return <span>{suggestion.name}</span>;
  }

  render() {
    if (this.state) {
      return <div><div class="row">
        <div class="col-sm-4">
          <h2>{this.state.title}</h2>
        </div>
      </div>
      { this.state.id ?
      <div class="row">
        <div class="col-sm-4">
          <Link to={`/book/${this.state.id}`}>Back to {this.state.title}</Link>
        </div>
      </div>
      : '' }
      <div class="row">
        &nbsp;
      </div>
      <div class="row">
        <div class="col-sm-4">
          <form onSubmit={this.submitForm}>
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" class="form-control" 
                value={this.state.title} onChange={this.changeTitle} />
            </div>
            <div class="form-group">
              <label>Author</label>
              <AutoSuggest suggestions={this.state.suggestions} 
                onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{ type: 'text', name: 'author', class: 'form-control', value: this.state.authors.name,
                  onChange: this.changeAuthor }} />
              <a href="/author/new">Create Author</a>
            </div>
            <div class="form-group">
              <label>Description</label>
              <input type="textarea" name="description" class="form-control" value={this.state.description} 
                onChange={this.changeDescription} />
            </div>
            <button type="submit" class="btn btn-default">Save</button>
          </form>
        </div>
      </div></div>;
    }
    else {
      return null;
    }
  }
}

function matchStateToProps(state) {
  return { token: state.token };
}

module.exports = connect(matchStateToProps)(withRouter(BookEditBase));

