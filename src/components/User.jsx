import React, {
  Component
} from 'react'
import {
  Link
} from 'react-router-dom'
import {
  connect
} from 'react-redux'
import {
  bindActionCreators
} from 'redux'
import {
  fetchUser,
  fetchSelf
} from '../actions'
import formatter from 'format-publish-date'

const format = raw => formatter(new Date(raw))

class NavBar extends Component {
  constructor() {
    super()
    this.state = {
      isSelf: false
    }
  }
  componentDidMount() {
    const {
      match,
      self
    } = this.props
    const name = match.params.name
    if (name === self.loginname) {
      this.setState({
        isSelf: true
      })
    } else {
      this.props.fetchUser(name)
    }
  }
  handleLogout() {}
  render() {
    const user = this.state.isSelf ? this.props.self : this.props.user
    const {
      recent_topics,
      recent_replies
    } = user
    const topics = recent_topics.map(topic => {
      return (
        <div key={topic.id} className="topic_item">
          <div className="user_avatar">
            <img src={topic.author.avatar_url} alt={topic.author.loginname} /> 
          </div> 
          <Link to={ '/topic/' + topic.id } className="topic_title">
            <h4>{ topic.title }</h4> 
          </Link> 
          <div className="reply_view">{ format(topic.last_reply_at) }</div> 
        </div>
      )
    })
    const replies = recent_replies.map(reply => {
      return (
        <div key={reply.id} className="topic_item">
          <div className="user_avatar">
            <img src={reply.author.avatar_url} alt={reply.author.loginname} /> 
          </div> 
          <Link to={ '/topic/' + reply.id } className="topic_title">
            <h4>{ reply.title }</h4> 
          </Link> 
          <div className="reply_view">{ format(reply.last_reply_at) }</div> 
        </div>
      )
    })
    const signout =
      <div className="button_container">
        <div className="button button_warning" onClick={this.handleLogout}>登出</div>
        <Link to={ '/user/' + user.loginname + '/notifications'} className="button button_primary">查看消息</Link>
      </div>
    return (
      <div>
        <div className="user_info panel">
          <div className="panel_title">个人简介</div>
          <div className="panel_container">
            <div className="user_row panel_row">
              <div className="user_avatar">
                <img src={user.avatar_url} alt={user.loginname} />
              </div>
              <div className="user_name">{ user.loginname }</div>
              { this.state.isSelf && signout }
            </div>
            <div className="user_github panel_row">github名称：{ user.githubUsername }</div>
            <div className="user_createdAt panel_row">注册于：{ format(user.create_at) }</div>
            <div className="user_score panel_row">积分：{ user.score }</div>
            {
              this.state.isSelf && 
              <div v-if="isSelf" className="user_notification panel_row">
                未读消息：{/*{ unread }*/}
              </div>
            }
          </div>
        </div>
        <div className="recent_topics panel">
          <div className="panel_title">最近参与的话题</div>
          {
            recent_topics.length === 0 ? 
            <p className="panel_empty">最近没有参与话题</p> : 
            <div className="recent_topic_list" v-if="user.recent_topics.length > 0">
              {topics}
            </div>
          }
        </div>
        <div className="recent_replies panel">
          <div className="panel_title">最近回复的话题</div>
          {
            recent_replies.length === 0 ? 
            <p className="panel_empty">最近没有参与话题</p> : 
            <div className="recent_topic_list">
              {replies}
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    self: state.self
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchUser,
    fetchSelf
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)