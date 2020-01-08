import React, { Component } from "react";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import TextField from "@material-ui/core/TextField";
import { withSnackbar } from "notistack";

import axios from "axios";

const MY_API_KEY = "AIzaSyBuUvsO2t14HU4mguhG0kpHFRdWuBEQfKw";

class Maps extends Component {
  state = {
    search: "",
    address: ""
  };

  handleInputChange = e => {
    this.setState({ search: e.target.value, address: e.target.address });
  };

  handleSelectSuggest = suggest => {
    this.setState({
      search: "",
      address: suggest.formatted_address
    });
    localStorage.setItem("address", suggest.formatted_address);
    localStorage.setItem("lat", suggest.geometry.location.lat());
    localStorage.setItem("lng", suggest.geometry.location.lng());
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${suggest.geometry.location.lat()},${suggest.geometry.location.lng()}&key=${MY_API_KEY}`
      )
      .then(response => {
        localStorage.setItem(
          "city",
          response.data.results[0].address_components[3].long_name
        );
        localStorage.setItem(
          "district",
          response.data.results[0].address_components[2].long_name
        );

        this.props.enqueueSnackbar("Endereço completo encontrado", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
        this.props.enqueueSnackbar(
          "Por favor, outras informações no campo 'Complemento'",
          {
            variant: "success",
            autoHideDuration: 2500,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center"
            }
          }
        );
      });
  };

  render() {
    const { search, address } = this.state;
    return (
      <ReactGoogleMapLoader
        params={{
          key: MY_API_KEY,
          libraries: "places,geocode"
        }}
        render={googleMaps =>
          googleMaps && (
            <ReactGooglePlacesSuggest
              googleMaps={googleMaps}
              autocompletionRequest={{
                input: search
              }}
              onNoResult={this.handleNoResult}
              onSelectSuggest={this.handleSelectSuggest}
              onStatusUpdate={this.handleStatusUpdate}
              displayPoweredByGoogle={false}
              textNoResults="Sua pesquisa não teve resultados"
              customRender={prediction => (
                <div className="customWrapper">
                  {prediction
                    ? prediction.description
                    : "Sua pesquisa não teve resultados"}
                </div>
              )}
            >
              <TextField
                type="text"
                onChange={this.handleInputChange}
                value={address}
                label="Pesquise o endereço"
                variant="outlined"
                fullWidth
              />
            </ReactGooglePlacesSuggest>
          )
        }
      />
    );
  }
}

export default withSnackbar(Maps);
