import React from 'react';
class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userUpdateName: '',
      user: {
        id:"",
        name:  "",
        email: "",
        entries: 0,
        joined: ""
      }
    }
  }

  displayUserInfo(user) {

  }
  onNameChange = (event) => {
    this.setState({userUpdateName: event.target.value})
  }
  onUpdateSubmit = (event) => {
    event.preventDefault();
    console.log("STATE",this.state.userUpdateName);
    fetch('http://localhost:3000/profile', {
      method: 'put',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        id: this.state.user.id,
        name: this.state.userUpdateName,
      })
    })
      .then(response => response.json())
      .then(userName => {
        this.props.loadUserName(userName);
        this.updateUserInfo();
      })
  }

  updateUserInfo = () => {
    this.setState(Object.assign(this.state.user,this.props.userInfo))
    this.setState({userUpdateName:this.props.userInfo.name})
  }

  componentDidMount() {
    this.updateUserInfo();
  }

  render() {
    return(
      <div className="flex flex-wrap center">
        <article className="b--black-10 mv4 w-100 w-50-m w-25-l mw6 tl">
          <h1>Info</h1>
          <div>
            <span>Email:</span>
            <span>{this.state.user.email}</span>
          </div>
          <div>
            <span>Current Name:</span>
            <span>{this.state.user.name}</span>
          </div>
          <div>
            <span>Number of Entries:</span>
            <span>{this.state.user.entries}</span>
          </div>
          <div>
            <span>Joined at: </span>
            <span>{this.state.user.joined}</span>
          </div>
        </article>
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 ">
          <main className="pa4 black-80">
            <form className="measure">
              <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f3 fw6 ph0 mh0">Change name</legend>
                <div className="mv3">
                  <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                  <input
                    onChange={this.onNameChange}
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="text"
                    name="name" 
                    placeholder={this.state.userUpdateName}
                    id="name"/>
                </div>
              </fieldset>
              <div className="">
                <input
                onClick={this.onUpdateSubmit}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit"
                value="Update"/>
              </div>
            </form>
          </main>
        </article>

      </div>
    );
  }
}


export default Profile;