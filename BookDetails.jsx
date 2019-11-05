import React from 'react';
import BookInfoBase from './BookInfoBase.jsx';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class BookDetails extends BookInfoBase {
  render() {
    if (this.state) {
      return <div>
          <div><Link to={'/books'}>Back to List</Link></div>
          <ul>
            <li>Book Title: {this.state.title}</li>
            <li>Book Author: {this.state.authors.name}</li>
            <li>Book Summary: {this.state.description}</li>
          </ul>
          { this.props.canEdit ? <Link to={`/book/${this.state.id}/edit`}>Edit Book</Link> : '' }
       </div>; 
    }
    else {
      return null;
    }
  }
}

function matchStateToProps(state) {
  return { canEdit: state.loginState.canEdit };
}

export default connect(matchStateToProps)(BookDetails);
