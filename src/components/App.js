import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes'
import base from '../base';

class App extends React.Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

    // getinitialState
    this.state = {
      fishes: {},
      order: {},
    };
  }

  // Can move setting the state out of the constructor like below
  // state = {
  //   fishes: {},
  //   order: {},
  // };

  // Sync Firebase database - Lifecycle method
  componentWillMount() {
    // this runs right before the app is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`
    , {
      context: this,
      state: 'fishes'
    });

    // check if there is any order in localStorage
    const localStoreRef = localStorage.getItem(`order-${this.props.params.storeId}`)

    if (localStoreRef) {
      // update our App component's order state
      this.setState({
        order: JSON.parse(localStoreRef)
      });
    }
  }

  // Unsync Firebase database when going to another store - Lifecycle method
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  // Lifecycle method for local storage - pass in two things
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    // update our state
    const fishes = {...this.state.fishes};
    // add in our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // this.state.fishes.fish1 = fish;
    // set state
    this.setState({ fishes });
  }

  updateFish(key, updatedFish) {
    // Make copy of fishes
    const fishes = {...this.state.fishes};
    // Overwrite that 1 updated fish with updatedFish object from Inventory
    fishes[key] = updatedFish;
    // Set state
    this.setState({ fishes });
  }

  // Probably will come to JavaScript
  // If you didn't want to bind this for updateFish in the constructor, you could do this:
  // updateFish = (key, updatedFish) => {
  //   const fishes = {...this.state.fishes};
  //   fishes[key] = updatedFish;
  //   this.setState({ fishes });
  // };

  removeFish(key) {
    // Make copy of fishes
    const fishes = {...this.state.fishes};
    // Remove the fish (running delete does no work with Firebase to get around this assign the fish that is being removed to null)
    fishes[key] = null;
    // Set state
    this.setState({ fishes });
  }

  // Probably will come to JavaScript
  // If you didn't want to bind this for removeFish in the constructor, you could do this:
  // removeFish = (key) => {
  //   const fishes = {...this.state.fishes};
  //   fishes[key] = null;
  //   this.setState({ fishes });
  // };


  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  // Probably will come to JavaScript
  // If you didn't want to bind this for loadSamples in the constructor, you could do this:
  // loadSamples = () => {
  //   this.setState({
  //     fishes: sampleFishes
  //   });
  // };

  addToOrder(key) {
    // take a copy of our state
    const order = {...this.state.order};
    // update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    // update our state
    this.setState({ order });
  }

  removeFromOrder(key) {
    // take a copy of our state
    const order = {...this.state.order};
    // delete the fish from the order
    delete order[key];
    // update our state
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          fishes={this.state.fishes}
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired,
};

export default App;
