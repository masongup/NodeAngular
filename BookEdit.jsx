import React from 'react';
import { serverUrl } from './consts.js';
import BookInfoBase from './BookInfoBase.jsx';
import { Link } from 'react-router-dom';
import AutoSuggest from 'react-autosuggest';
import { connect } from 'react-redux';

class BookEdit extends BookInfoBase {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAuthor = this.changeAuthor.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.state = { authors: { name: '' }, suggestions: [], title: '', description: '' };
  }

  componentDidMount() {
    const stateObj = { };
    if (this.props.params.bookId) {
      super.componentDidMount();
    }
    else {
      stateObj.authors = { name: '', id: null };
    }
    stateObj.suggestions = [];
    this.setState(stateObj);
  }

  changeTitle(event) {
    this.setState({ title: event.target.value });
  }
  changeAuthor(e) {
    if (e.target.value) {
      this.setState({ authors: { name: e.target.value } });
    }
  }
  changeDescription(e) {
    this.setState({ description: e.target.value });
  }

  submitForm(e) {
    e.preventDefault();
    const fetchOptions = {
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description,
        author_id: this.state.authors.id
      }),
      headers: new Headers({
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      })
    };
    if (this.props.params.bookId) {
      fetchOptions.method = 'PATCH';
      fetch(`${serverUrl}books?id=eq.${this.props.match.params.bookId}`, fetchOptions)
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

  onSuggestionSelected(event, { suggestion }) {
    this.setState({ authors: suggestion });
  }

  onSuggestionsUpdateRequested({ value, reason }) {
    fetch(`${serverUrl}authors?name=like.${value}*&order=name`, {
          headers: new Headers({ Range: '0-50' })
        })
      .then(resp => resp.json())
      .then(respJ => this.setState({ suggestions: respJ }));
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    return <span>{suggestion.name}</span>;
  }

  render() {
    const suggestProps = {
      type: 'text',
      name: 'author',
      className: 'form-control',
      value: this.state.authors.name,
      onChange: this.changeAuthor
    };
    if (this.state) {
      return <div><div className="row">
        <div className="col-sm-4">
          <h2>{this.state.title}</h2>
        </div>
      </div>
      { this.state.id ?
      <div className="row">
        <div className="col-sm-4">
          <Link to={`/book/${this.state.id}`}>Back to {this.state.title}</Link>
        </div>
      </div>
      : '' }
      <div className="row">
        &nbsp;
      </div>
      <div className="row">
        <div className="col-sm-4">
          <form onSubmit={this.submitForm}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" className="form-control"
                value={this.state.title} onChange={this.changeTitle} />
            </div>
            <div className="form-group">
              <label>Author</label>
              <AutoSuggest suggestions={this.state.suggestions}
                onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                onSuggestionSelected={this.onSuggestionSelected}
                inputProps={suggestProps} />
              <Link to={"/author/new"}>Create Author</Link>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="textarea" name="description" className="form-control" value={this.state.description}
                onChange={this.changeDescription} />
            </div>
            <button type="submit" className="btn btn-default">Save</button>
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
  return { token: state.loginState.token };
}

export default connect(matchStateToProps)(BookEdit);

