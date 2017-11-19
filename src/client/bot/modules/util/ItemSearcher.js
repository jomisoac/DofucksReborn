import React from 'react';

import Module from '../../Module';
import Item from './ItemSearcher/Item';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import { Grid, Row, Cell } from 'react-inline-grid';

import axios from 'axios';

class ItemSearcher extends Module {
  constructor(props) {
    super(props)
    this.tag = this.props.tag;
    this.state._[this.tag] = [];
    this.state.searchText = '';
    this.state.items = [];
  }

  onLoaded(data) {
    if (data) {
      data = data.filter((e) => {
        return typeof e == "object"
      })
      var items = data.map(e => e.value);
      this.props.setItems(items);
    }
    return data;
  }

  fetchItems() {
    if (this.state.searchText.length < 3) return;
    axios.get('http://dofucks.com:8000/search/items', {
      params: {
        q: this.state.searchText,
        l: this.props.win.Config.language
      }
    })
    .then(r => {
      var items = [];
      r.data.forEach((e, i) => {
        items.push({text: e.nameId, value: e.id, iconId: e.iconId});
      })
      this.setState({items: items});
    });
  }

  handleUpdateInput(searchText) {
    this.setState({
      searchText: searchText,
    }, () => {
      this.fetchItems();
    });
  }

  handleNewRequest(item) {
    var oldItems = this.state._[this.tag];
    var found = false;
    oldItems.forEach(e => {
      if (item.value == e.value) found = true;
    })
    if (!found) {
      oldItems.push(item);
      this.saveData(oldItems);
    }
    this.setState({
      searchText: '',
      items: []
    });
  }

  onItemClick(itemId) {
    var items = this.state._[this.tag];
    var newItems = items.filter(e => e.value != itemId);
    this.saveData(newItems);
  }

  saveData(newItems) {
    var items = newItems.map(e => e.value)
    this.setValue(newItems);
    this.props.setItems(items);
  }

  render() {
    return (
      <div>
        <AutoComplete
          hintText="Type the name of an item"
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput.bind(this)}
          onNewRequest={this.handleNewRequest.bind(this)}
          dataSource={this.state.items}
          filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
          openOnFocus={true}
          fullWidth={true}
        />
        <Grid>
          <Row is="nospace">
            {
              this.state._[this.tag].map((e, i) => {
                return (
                  <Item key={i} id={e.value} iconId={e.iconId} onItemClick={this.onItemClick.bind(this)}/>
                )
              })
            }
          </Row>
        </Grid>
    </div>
    );
  }
}

export default ItemSearcher;
