import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(onChange) {
    this.props.onNameChange('defaultValue');
  }
  render() { return (
    <div className="Playlist">
      <input onChange={this.props.handleNameChange} defaultValue={'New Playlist'}/>
      <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval="true" />
      <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
    </div>
  );
 }
}

export default Playlist;
