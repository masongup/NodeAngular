const React = require('react');
const { serverUrl } = require('./consts.js');
const BookInfoBase = require('./BookInfoBase.jsx');
const { Link, withRouter } = require('react-router');
const securityService = require('./SecurityService.jsx');

class BookEditBase extends BookInfoBase {
  componentDidMount() {
    if (this.props.params.bookId) {
      super.componentDidMount();
    }
    else {
      this.setState({ authors: {} });
    }
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
        'Authorization': `Bearer ${securityService.getToken()}`,
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
          <form onSubmit={this.submitForm.bind(this)}>
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" class="form-control" 
                value={this.state.title} onChange={this.changeTitle.bind(this)} />
            </div>
            <div class="form-group">
              <label>Author</label>
              <input type="text" name="author" class="form-control" value={this.state.authors.name} 
                onChange={this.changeAuthor.bind(this)} />
              <a href="/author/new">Create Author</a>
            </div>
            <div class="form-group">
              <label>Description</label>
              <input type="textarea" name="description" class="form-control" value={this.state.description} 
                onChange={this.changeDescription.bind(this)} />
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

module.exports = withRouter(BookEditBase);

