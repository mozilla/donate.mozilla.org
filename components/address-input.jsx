import React from 'react';
import IntlMixin from 'react-intl';
import Input from './input.jsx';

var CountrySelect = React.createClass({
  mixins: [IntlMixin],
  validate: function() {
    return !!this.props.country;
  },
  render: function() {
    var countryClassName = this.props.className;
    if (this.props.country) {
      countryClassName = "normal-text-color";
    }
    return (
      <div className="field-container">
        <i className="fa fa-map-marker field-icon"></i>
        <select onChange={this.props.onCountryChange} name="country" value={this.props.country} className={countryClassName}>
          <option value="">{this.getIntlMessage('country')}</option>
          <option value="AF">Afghanistan</option>
          <option value="AL">Albania</option>
          <option value="DZ">Algeria</option>
          <option value="AS">American Samoa</option>
          <option value="AD">Andorra</option>
          <option value="AO">Angola</option>
          <option value="AI">Anguilla</option>
          <option value="AG">Antigua and Barbuda</option>
          <option value="AR">Argentina</option>
          <option value="AM">Armenia</option>
          <option value="AW">Aruba</option>
          <option value="AU">Australia</option>
          <option value="AT">Austria</option>
          <option value="AZ">Azerbaijan</option>
          <option value="BS">Bahamas</option>
          <option value="BH">Bahrain</option>
          <option value="BD">Bangladesh</option>
          <option value="BB">Barbados</option>
          <option value="BY">Belarus</option>
          <option value="BE">Belgium</option>
          <option value="BZ">Belize</option>
          <option value="BJ">Benin</option>
          <option value="BM">Bermuda</option>
          <option value="BT">Bhutan</option>
          <option value="BO">Bolivia</option>
          <option value="BA">Bosnia and Herzegovina</option>
          <option value="BW">Botswana</option>
          <option value="BR">Brazil</option>
          <option value="VG">British Virgin Islands</option>
          <option value="IO">British Indian Ocean Territory</option>
          <option value="BN">Brunei</option>
          <option value="BG">Bulgaria</option>
          <option value="BF">Burkina Faso</option>
          <option value="BI">Burundi</option>
          <option value="KH">Cambodia</option>
          <option value="CM">Cameroon</option>
          <option value="CA">Canada</option>
          <option value="CV">Cape Verde</option>
          <option value="KY">Cayman Islands</option>
          <option value="CF">Central African Republic</option>
          <option value="TD">Chad</option>
          <option value="CL">Chile</option>
          <option value="CN">China</option>
          <option value="CX">Christmas Island</option>
          <option value="CO">Colombia</option>
          <option value="KM">Comoros Islands</option>
          <option value="CD">Congo, Democratic Republic of the</option>
          <option value="CG">Congo, Republic of the</option>
          <option value="CK">Cook Islands</option>
          <option value="CR">Costa Rica</option>
          <option value="CI">Cote D&#39;ivoire</option>
          <option value="HR">Croatia</option>
          <option value="CY">Cyprus</option>
          <option value="CZ">Czech Republic</option>
          <option value="DK">Denmark</option>
          <option value="DJ">Djibouti</option>
          <option value="DM">Dominica</option>
          <option value="DO">Dominican Republic</option>
          <option value="TP">East Timor</option>
          <option value="EC">Ecuador</option>
          <option value="EG">Egypt</option>
          <option value="SV">El Salvador</option>
          <option value="GQ">Equatorial Guinea</option>
          <option value="ER">Eritrea</option>
          <option value="EE">Estonia</option>
          <option value="ET">Ethiopia</option>
          <option value="FK">Falkland Islands (Malvinas)</option>
          <option value="FO">Faroe Islands</option>
          <option value="FJ">Fiji</option>
          <option value="FI">Finland</option>
          <option value="FR">France</option>
          <option value="GF">French Guiana</option>
          <option value="PF">French Polynesia</option>
          <option value="TF">French Southern Territories</option>
          <option value="GA">Gabon</option>
          <option value="GM">Gambia</option>
          <option value="GE">Georgia</option>
          <option value="DE">Germany</option>
          <option value="GH">Ghana</option>
          <option value="GI">Gibraltar</option>
          <option value="GR">Greece</option>
          <option value="GL">Greenland</option>
          <option value="GD">Grenada</option>
          <option value="GP">Guadeloupe</option>
          <option value="GU">Guam</option>
          <option value="GT">Guatemala</option>
          <option value="GN">Guinea</option>
          <option value="GW">Guinea-Bissau</option>
          <option value="GY">Guyana</option>
          <option value="HT">Haiti</option>
          <option value="VA">Holy See (Vatican City State)</option>
          <option value="HN">Honduras</option>
          <option value="HK">Hong Kong</option>
          <option value="HU">Hungary</option>
          <option value="IS">Iceland</option>
          <option value="IN">India</option>
          <option value="ID">Indonesia</option>
          <option value="IQ">Iraq</option>
          <option value="IE">Republic of Ireland</option>
          <option value="IL">Israel</option>
          <option value="IT">Italy</option>
          <option value="JM">Jamaica</option>
          <option value="JP">Japan</option>
          <option value="JO">Jordan</option>
          <option value="KZ">Kazakhstan</option>
          <option value="KE">Kenya</option>
          <option value="KI">Kiribati</option>
          <option value="KR">South Korea</option>
          <option value="XK">Kosovo</option>
          <option value="KW">Kuwait</option>
          <option value="KG">Kyrgyzstan</option>
          <option value="LA">Laos</option>
          <option value="LV">Latvia</option>
          <option value="LB">Lebanon</option>
          <option value="LS">Lesotho</option>
          <option value="LR">Liberia</option>
          <option value="LY">Libya</option>
          <option value="LI">Liechtenstein</option>
          <option value="LT">Lithuania</option>
          <option value="LU">Luxembourg</option>
          <option value="MO">Macau</option>
          <option value="MK">Macedonia</option>
          <option value="MG">Madagascar</option>
          <option value="MW">Malawi</option>
          <option value="MY">Malaysia</option>
          <option value="MV">Maldives</option>
          <option value="ML">Mali</option>
          <option value="MT">Malta</option>
          <option value="MH">Marshall Islands</option>
          <option value="MQ">Martinique</option>
          <option value="MR">Mauritania</option>
          <option value="MU">Mauritius</option>
          <option value="YT">Mayotte</option>
          <option value="MX">Mexico</option>
          <option value="FM">Micronesia</option>
          <option value="MD">Moldova, Republic of</option>
          <option value="MC">Monaco</option>
          <option value="MN">Mongolia</option>
          <option value="ME">Montenegro</option>
          <option value="MS">Montserrat</option>
          <option value="MA">Morocco</option>
          <option value="MZ">Mozambique</option>
          <option value="MM">Myanmar</option>
          <option value="NA">Namibia</option>
          <option value="NR">Nauru</option>
          <option value="NP">Nepal</option>
          <option value="NL">Netherlands</option>
          <option value="AN">Netherlands Antilles</option>
          <option value="NC">New Caledonia</option>
          <option value="NZ">New Zealand</option>
          <option value="NI">Nicaragua</option>
          <option value="NE">Niger</option>
          <option value="NG">Nigeria</option>
          <option value="NU">Niue</option>
          <option value="NF">Norfolk Island</option>
          <option value="MP">Northern Mariana Islands</option>
          <option value="NO">Norway</option>
          <option value="OM">Oman</option>
          <option value="PK">Pakistan</option>
          <option value="PW">Palau</option>
          <option value="PA">Panama</option>
          <option value="PG">Papua New Guinea</option>
          <option value="PY">Paraguay</option>
          <option value="PE">Peru</option>
          <option value="PH">Philippines</option>
          <option value="PN">Pitcairn Island</option>
          <option value="PL">Poland</option>
          <option value="PT">Portugal</option>
          <option value="PR">Puerto Rico</option>
          <option value="QA">Qatar</option>
          <option value="RE">Reunion</option>
          <option value="RO">Romania</option>
          <option value="RU">Russian Federation</option>
          <option value="RW">Rwanda</option>
          <option value="KN">Saint Kitts and Nevis</option>
          <option value="LC">Saint Lucia</option>
          <option value="VC">Saint Vincent and the Grenadines</option>
          <option value="WS">Samoa</option>
          <option value="SM">San Marino</option>
          <option value="ST">Sao Tome and Principe</option>
          <option value="SA">Saudi Arabia</option>
          <option value="SN">Senegal</option>
          <option value="RS">Serbia</option>
          <option value="SC">Seychelles</option>
          <option value="SL">Sierra Leone</option>
          <option value="SG">Singapore</option>
          <option value="SK">Slovakia</option>
          <option value="SI">Slovenia</option>
          <option value="SB">Solomon Islands</option>
          <option value="SO">Somalia</option>
          <option value="ZA">South Africa</option>
          <option value="SS">South Sudan</option>
          <option value="ES">Spain</option>
          <option value="LK">Sri Lanka</option>
          <option value="SH">St. Helena</option>
          <option value="PM">St. Pierre and Miquelon</option>
          <option value="SR">Suriname</option>
          <option value="SZ">Swaziland</option>
          <option value="SE">Sweden</option>
          <option value="CH">Switzerland</option>
          <option value="TW">Taiwan</option>
          <option value="TJ">Tajikistan</option>
          <option value="TZ">Tanzania</option>
          <option value="TH">Thailand</option>
          <option value="TG">Togo</option>
          <option value="TK">Tokelau</option>
          <option value="TO">Tonga</option>
          <option value="TT">Trinidad and Tobago</option>
          <option value="TN">Tunisia</option>
          <option value="TR">Turkey</option>
          <option value="TM">Turkmenistan</option>
          <option value="TC">Turks and Caicos Islands</option>
          <option value="TV">Tuvalu</option>
          <option value="UG">Uganda</option>
          <option value="UA">Ukraine</option>
          <option value="AE">United Arab Emirates</option>
          <option value="GB">United Kingdom</option>
          <option value="US">United States</option>
          <option value="UY">Uruguay</option>
          <option value="UZ">Uzbekistan</option>
          <option value="VU">Vanuatu</option>
          <option value="VE">Venezuela</option>
          <option value="VN">Viet Nam</option>
          <option value="VI">Virgin Islands (U.S.)</option>
          <option value="WF">Wallis and Futuna Islands</option>
          <option value="EH">Western Sahara</option>
          <option value="YE">Yemen</option>
          <option value="ZM">Zambia</option>
          <option value="ZW">Zimbabwe</option>
        </select>
      </div>
    );
  }
});

var ProvinceSelect = React.createClass({
  mixins: [IntlMixin],
  validate: function() {
    if (this.props.province || !this.refs.provinceSelect) {
      return true;
    }
    return false;
  },
  render: function() {
    var provinceClassName = this.props.className;
    if (this.props.province) {
      provinceClassName += " normal-text-color";
    }
    if (this.props.country === "US") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="U.S. States and Territories">
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AS">American Samoa</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="AA">Armed Forces Americas</option>
            <option value="AE">Armed Forces Europe</option>
            <option value="AP">Armed Forces Pacific</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="GU">Guam</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MH">Marshall Islands</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="FM">Micronesia</option>
            <option value="MN">Minnesota</option>
            <option value="UM">Minor Outlying Islands</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="MP">Northern Mariana Islands</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PW">Palau</option>
            <option value="PA">Pennsylvania</option>
            <option value="PR">Puerto Rico</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VI">Virgin Islands</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "AU") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Australian States">
            <option value="Australian Capital Territory">Australian Capital
              Territory
            </option>
            <option value="New South Wales">New South Wales</option>
            <option value="Northern Territory">Northern Territory</option>
            <option value="Queensland">Queensland</option>
            <option value="South Australia">South Australia</option>
            <option value="Tasmania">Tasmania</option>
            <option value="Victoria">Victoria</option>
            <option value="Western Australia">Western Australia</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "BR") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Brazilian States">
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AM">Amazonas</option>
            <option value="AP">Amapá</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RO">Rondônia</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SE">Sergipe</option>
            <option value="SP">São Paulo</option>
            <option value="TO">Tocantins</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "CA") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Canadian Provinces">
            <option value="Alberta">Alberta</option>
            <option value="British Columbia">British Columbia</option>
            <option value="Manitoba">Manitoba</option>
            <option value="New Brunswick">New Brunswick</option>
            <option value="Newfoundland and Labrador">Newfoundland and
              Labrador
            </option>
            <option value="Northwest Territories">Northwest Territories
            </option>
            <option value="Nova Scotia">Nova Scotia</option>
            <option value="Nunavut">Nunavut</option>
            <option value="Ontario">Ontario</option>
            <option value="Prince Edward Island">Prince Edward Island</option>
            <option value="Quebec">Quebec</option>
            <option value="Saskatchewan">Saskatchewan</option>
            <option value="Yukon">Yukon</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "IE") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Irish Counties">
            <option value="Antrim">Antrim</option>
            <option value="Armagh">Armagh</option>
            <option value="Carlow">Carlow</option>
            <option value="Cavan">Cavan</option>
            <option value="Clare">Clare</option>
            <option value="Cork">Cork</option>
            <option value="Derry">Derry</option>
            <option value="Donegal">Donegal</option>
            <option value="Down">Down</option>
            <option value="Dublin">Dublin</option>
            <option value="Fermanagh">Fermanagh</option>
            <option value="Galway">Galway</option>
            <option value="Kerry">Kerry</option>
            <option value="Kildare">Kildare</option>
            <option value="Kilkenny">Kilkenny</option>
            <option value="Laois">Laois</option>
            <option value="Leitrim">Leitrim</option>
            <option value="Limerick">Limerick</option>
            <option value="Longford">Longford</option>
            <option value="Louth">Louth</option>
            <option value="Mayo">Mayo</option>
            <option value="Meath">Meath</option>
            <option value="Monaghan">Monaghan</option>
            <option value="Offaly">Offaly</option>
            <option value="Roscommon">Roscommon</option>
            <option value="Sligo">Sligo</option>
            <option value="Tipperary">Tipperary</option>
            <option value="Tyrone">Tyrone</option>
            <option value="Waterford">Waterford</option>
            <option value="Westmeath">Westmeath</option>
            <option value="Wexford">Wexford</option>
            <option value="Wicklow">Wicklow</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "MX") {
      return (
        <select onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Mexican States">
            <option value="Aguascalientes">Aguascalientes</option>
            <option value="Baja California Norte">Baja California Norte
            </option>
            <option value="Baja California Sur">Baja California Sur</option>
            <option value="Campeche">Campeche</option>
            <option value="Chiapas">Chiapas</option>
            <option value="Chihuahua">Chihuahua</option>
            <option value="Coahuila">Coahuila</option>
            <option value="Colima">Colima</option>
            <option value="Distrito Federal">Distrito Federal</option>
            <option value="Durango">Durango</option>
            <option value="Guanajuato">Guanajuato</option>
            <option value="Guerrero">Guerrero</option>
            <option value="Hidalgo">Hidalgo</option>
            <option value="Jalisco">Jalisco</option>
            <option value="Mexico (Estado de)">Mexico (Estado de)</option>
            <option value="Michoacan">Michoacan</option>
            <option value="Morelos">Morelos</option>
            <option value="Nayarit">Nayarit</option>
            <option value="Nuevo Leon">Nuevo Leon</option>
            <option value="Oaxaca">Oaxaca</option>
            <option value="Puebla">Puebla</option>
            <option value="Queretaro">Queretaro</option>
            <option value="Quintana Roo">Quintana Roo</option>
            <option value="San Luis Potosi">San Luis Potosi</option>
            <option value="Sinaloa">Sinaloa</option>
            <option value="Sonora">Sonora</option>
            <option value="Tabasco">Tabasco</option>
            <option value="Tamaulipas">Tamaulipas</option>
            <option value="Tlaxcala">Tlaxcala</option>
            <option value="Veracruz">Veracruz</option>
            <option value="Yucatan">Yucatan</option>
            <option value="Zacatecas">Zacatecas</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "ZA") {
      return (
        <select onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="South African Provinces">
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Gauteng">Gauteng</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="North West">North West</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="Western Cape">Western Cape</option>
          </optgroup>
        </select>
      );
    } else if (this.props.country === "SE") {
      return (
        <select onChange={this.props.onProvinceChange} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Swedish Provinces">
            <option value="Blekinge">Blekinge</option>
            <option value="Dalarna">Dalarna</option>
            <option value="Gavleborg">Gavleborg</option>
            <option value="Gotland">Gotland</option>
            <option value="Halland">Halland</option>
            <option value="Jamtland">Jamtland</option>
            <option value="Jonkoping">Jonkoping</option>
            <option value="Kalmar">Kalmar</option>
            <option value="Kronoberg">Kronoberg</option>
            <option value="Norrbotten">Norrbotten</option>
            <option value="Orebro">Orebro</option>
            <option value="Ostergotland">Ostergotland</option>
            <option value="Skane">Skane</option>
            <option value="Sodermanland">Sodermanland</option>
            <option value="Stockholm">Stockholm</option>
            <option value="Uppsala">Uppsala</option>
            <option value="Varmland">Varmland</option>
            <option value="Vasterbotten">Vasterbotten</option>
            <option value="Vasternorrland">Vasternorrland</option>
            <option value="Vastmanland">Vastmanland</option>
            <option value="Vastra Gotaland">Vastra Gotaland</option>
          </optgroup>
        </select>
      );
    }
    return <div></div>;
  }
});

var Country = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      valid: true
    };
  },
  onCountryChange: function(e) {
    this.setState({
      valid: true
    });
    this.props.onChange(this.props.name, this, "country", e.currentTarget.value);
  },
  validate: function() {
    var valid = true;
    if (!this.refs.countrySelect.validate()) {
      valid = false;
      this.setState({
        valid: valid
      });
    }
    return valid;
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this, "country", this.props.value);
  },
  render: function() {
    var className = "";
    if (!this.state.valid) {
      className += " parsley-error";
    }
    return (
      <CountrySelect ref="countrySelect" country={this.props.value} onCountryChange={this.onCountryChange} className={className}/>
    );
  }
});

var Province = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      valid: true
    };
  },
  onProvinceChange: function(e) {
    this.setState({
      valid: true
    });
    this.props.onChange(this.props.name, this, "province", e.currentTarget.value);
  },
  validate: function() {
    var valid = true;
    if (!this.refs.provinceSelect.validate()) {
      valid = false;
      this.setState({
        valid: valid
      });
    }
    return valid;
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this, "province", this.props.value);
  },
  render: function() {
    var className = "";
    if (!this.state.valid) {
      className += " parsley-error";
    }
    return (
      <ProvinceSelect ref="provinceSelect" country={this.props.country} onProvinceChange={this.onProvinceChange} className={className} province={this.props.value}/>
    );
  }
});

var Code = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <Input
        {...this.props}
        placeholder={this.getIntlMessage('postal_code')}
        type="code"
      />
    );
  }
});

var City = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <Input
        {...this.props}
        placeholder={this.getIntlMessage('city')}
        type="city"
      />
    );
  }
});

var Address = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <Input
        {...this.props}
        placeholder={this.getIntlMessage('address')}
        type="address"
      />
    );
  }
});

module.exports = {
  Country: Country,
  Address: Address,
  Province: Province,
  City: City,
  Code: Code
};
