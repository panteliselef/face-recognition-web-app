import React, { Component } from 'react';
import Navigation from './component/Navigation/Navigation'
import SignIn from './component/SignIn/SignIn'
import Register from './component/Register/Register'
import Logo from './component/Logo/Logo'
import Profile from './component/Profile/Profile'
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm'
import Rank from './component/Rank/Rank'
import Particles from 'react-particles-js';
import './App.css';
import 'tachyons';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';


//TODO: add Node.js API (server.js) to this project
// https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0

const particlesOptions = {
  particles: {
    number: {
      value:30,
      density: {
        enable:true,
        value_area:500
      }
    }
  }
}
const textStart = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'home',
  isSignedIn: true,
  currUser: {
    id:"1",
    name:  "Pantelis",
    email: "panteliselef@outlook.com",
    entries: 0,
    joined: "DATE HERE"
  }
}



const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  currUser: {
    id:"",
    name:  "",
    email: "",
    entries: 0,
    joined: ""
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log)
      .catch(err => console.log("can't connect to db"))
  }
  componentDidUpdate() {
    console.log(this.state);
  }

  loadUser = (data) => {
    console.log("loadUser",data)
    this.setState({currUser: {
      id:data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  loadUserName = (name) => {
    console.log("loadUserName",name)
    let newState = Object.assign({}, this.state);
    newState.currUser.name = name;
    this.setState(newState);
  }


  calculateFaceLocation = (res) => {
    const clarifaiFace = res.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    const image = document.getElementById('inputImage');
    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);
    return  {
      leftCol: clarifaiFace.left_col * imageWidth,
      topRow: clarifaiFace.top_row * imageHeight,
      rightCol: imageWidth - (clarifaiFace.right_col * imageWidth),
      bottomRow: imageHeight - (clarifaiFace.bottom_row * imageHeight)
    }
  }

  displayFaceBox = (boxData) => {
    console.log(boxData);
    this.setState({box: boxData});
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    }else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers : {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response));
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.currUser.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.currUser,{entries:count}));
            })
            .catch(console.log)
          }
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App" style={{color:"#fff"}}>
        <Particles className="particles"
              params={particlesOptions} style={{color:"#000"}}
            />
        <Navigation route={this.state.route} isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
          ? <React.Fragment>
              <Logo/>
              <Rank name={this.state.currUser.name} entries={this.state.currUser.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imgUrl={this.state.imageUrl}/>
            </React.Fragment>
          : (
              this.state.route === 'signin' || this.state.route === 'signout'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : (
                this.state.route === 'profile'
              ? <Profile loadUserName={this.loadUserName} userInfo={this.state.currUser}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
            )
           
        }
      </div>
    );
  }
}

export default App;
