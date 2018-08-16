import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults:  ['name','artist','album','id'],
      playlistName: 'templistname',
      playlistTracks: ['name','artist','album','id']
  }
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlayList = this.savePlayList.bind(this);
  this.search = this.search.bind(this);
}
addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }
  removeTrack(track) {
     let tracks = this.state.playlistTracks;
     tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
     this.setState({playlistTracks: tracks});
   }

savePlayList() {
  const trackURIs = this.state.playlistTracks.map(track => track.uri);
  Spotify.savePlayList(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
      });
}
search(searchTerm) {
  Spotify.search(searchTerm).then(searchResults => {
    this.setState({searchResults: searchResults});
  });
}

updatePlaylistName(name) {
  this.setState({playlistName: name});
}

  render() {
    return (
<div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search}/>
    <div className="App-playlist">

          <SearchResults onAdd={this.addTrack}
                         searchResults={this.state.searchResults} />

          <Playlist onNameChange={this.updatePlaylistName}
                    onRemove={this.removeTrack}
                    playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks}
                    onSave={this.savePlayList} />
    </div>
  </div>
</div>
    );
  }
}

export default App;
