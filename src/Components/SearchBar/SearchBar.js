import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     term: ''
        // };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    };

    // componentDidMount() {
    //     input.addEventListener('keyup', (event) => {
    //         if (event.keyCode === 13) {
    //             this.search();
    //         }
    //     });
    // };

    // componentWillUnmount() {}

    search(e) {
        e.preventDefault();
        // console.log("Enter pressed");
        this.props.onSearch(this.state.term);
    };

    handleTermChange(event) {
        this.setState({
            term: event.target.value
        });
    };

    render() {
        return (
            <div className="SearchBar">
                <form onSubmit={this.search} className="formBar">
                    <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
                    <br />
                    <button type="submit" className="SearchButton">SEARCH</button>
                </form>
            </div>
        );
    };
}

export default SearchBar;