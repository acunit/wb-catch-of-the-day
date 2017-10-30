import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }

  // Lifecycle method to ensure we don't have to keep loging in on page refresh
  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    // take a copy of that fish and update it with the new database
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish)
  }

  authenticate(provider) {
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  authHandler(err, authData) {
    console.log(authData);
    if (err) {
      console.log(err);
      return;
    }

    // grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // query the firebase once for the data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // claim it as our own if there is no owner already
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      // This sets the state so we can see utilize the app
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });

  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
      </nav>
    )
  }

  // onChange handler, triggers when anyone types or changes input. This calls the handleChange() above. This takes a copy of the fish where the change occured, and overwrites the value that was changed. This then is passed up to the updateFish() that lives on the App component. This takes in the key and updatedFish object. Then we take a copy of all of the fishes, then overwrites the one updated fish with updatedFish object, then we set the state. This in turn, updates our typebox.
  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text"name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)}/>
        <input type="text"name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)}/>

        <select type="text"name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>

        <textarea type="text"name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
        <input type="text"name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>;

    // Check if they are not logged in at all
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store!</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }

  // If wanted, you can remove the Inventory.propTypes and put this in the component
  // static propTypes = {
  //   fishes: React.PropTypes.object.isRequired,
  //   addFish: React.PropTypes.func.isRequired,
  //   updateFish: React.PropTypes.func.isRequired,
  //   removeFish: React.PropTypes.func.isRequired,
  //   loadSamples: React.PropTypes.func.isRequired,
  //   storeId: React.PropTypes.string.isRequired,
  // };

}



Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
};

export default Inventory;
