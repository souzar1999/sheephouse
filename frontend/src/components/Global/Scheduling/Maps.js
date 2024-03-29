import React, { Component } from "react";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import TextField from "@material-ui/core/TextField";
import { withSnackbar } from "notistack";
import axios from "axios";

require("dotenv").config();

const MY_API_KEY = process.env.REACT_APP_GAPI_KEY;

class Maps extends Component {
  state = {
    search: "",
    address: this.props.address,
  };

  handleInputChange = (e) => {
    this.setState({ search: e.target.value, address: e.target.address });
  };

  handleSelectSuggest = (suggest) => {
    this.setState({
      search: "",
      address: suggest.formatted_address,
    });
    const address = suggest.formatted_address,
      lat = suggest.geometry.location.lat(),
      lng = suggest.geometry.location.lng();
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${suggest.geometry.location.lat()},${suggest.geometry.location.lng()}&key=${MY_API_KEY}`
      )
      .then((response) => {
        const city = response.data.results[0].address_components.find(
          (item) => {
            return item.types.includes("administrative_area_level_2");
          }
        );

        const district = response.data.results[0].address_components.find(
          (item) => {
            return item.types.includes("sublocality");
          }
        );

        this.props.enqueueSnackbar("Endereço completo encontrado", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        this.props.enqueueSnackbar(
          "Por favor, outras informações no campo 'Complemento'",
          {
            variant: "success",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          }
        );

        this.props.addressInfo(
          address,
          lat,
          lng,
          city.long_name,
          district.long_name
        );
      });
  };

  render() {
    const { search, address } = this.state;

    return (
      <ReactGoogleMapLoader
        params={{
          key: MY_API_KEY,
          libraries: "places,geocode",
        }}
        render={(googleMaps) =>
          googleMaps && (
            <ReactGooglePlacesSuggest
              googleMaps={googleMaps}
              autocompletionRequest={{
                input: search,
                componentRestrictions: { country: "br" },
              }}
              onNoResult={this.handleNoResult}
              onSelectSuggest={this.handleSelectSuggest}
              onStatusUpdate={this.handleStatusUpdate}
              displayPoweredByGoogle={false}
              textNoResults="Sua pesquisa não teve resultados"
              customRender={(prediction) => (
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
                className={this.props.className} 
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
