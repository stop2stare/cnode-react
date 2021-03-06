import React, {
  Component
} from 'react'
import {
  connect
} from 'react-redux'
import {
  Link
} from 'react-router-dom'
import {
  bindActionCreators
} from 'redux'
import {
  fetchTopics,
  fetchMoreTopics,
  resetPage
} from 'actions/topics'
import './indexPage'

class IndexPage extends Component {
  componentWillMount() {
    const {
      match,
      topics,
      fetchTopics
    } = this.props
    const tab = match.params.id || 'all'

    fetchTopics({
      tab,
      page: topics.page
    })
  }
  componentWillReceiveProps({
    topics,
    fetchTopics,
    match
  }) {
    const tab = topics.tab
    const newTab = match.params.id || 'all'

    if (newTab !== tab) {
      fetchTopics({
        tab: newTab,
        page: 1
      })
    }
  }

  // when leaving this page, reset page data
  componentWillUnmount() {
    this.props.resetPage()
  }
  loadMore() {
    const {
      topics,
      fetchMoreTopics
    } = this.props

    fetchMoreTopics(topics)
  }
  render() {
    const topicList = this.props.topics.list.map(item => {
      return (
        <div className="topic_item" key={ item.id }>
          <Link to={ '/user/' + item.author.loginname } className="user_avatar">
            <img src={ item.author.avatar_url } alt={ item.title } />
          </Link>
          <h4 className="topic_title">
            <Link to={ '/topic/' + item.id }>{ item.title }</Link>
          </h4>
          <div className="reply_view">
            <span className="reply_number">{ item.reply_count }</span>
            <span className="seperate">/</span>
            <span className="view_number">{ item.visit_count}</span>
          </div>
        </div>
      )
    })
    return (
      <div className="topic_list">
        { topicList }
        <span onClick={ this.loadMore.bind(this) } className="load_more">查看更多</span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    topics: state.topics
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchTopics,
    fetchMoreTopics,
    resetPage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage)