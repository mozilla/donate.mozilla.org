import React from 'react';
import IntlMixin from 'react-intl';
import Input from './input.jsx';
import listener from '../scripts/listener.js';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';

const COUNTRIES_WITHOUT_POSTCODES = [
  "AO", "AG", "AW", "BS", "BZ", "BJ", "BW", "BF", "BI", "BO",
  "CM", "CF", "KM", "CG", "CD", "CK", "CI", "DJ", "DM", "GQ",
  "ER", "FJ", "TF", "GM", "GH", "GD", "GN", "GY", "HK", "IE",
  "JM", "KE", "KI", "MO", "MW", "ML", "MR", "MU", "MS", "NR",
  "AN", "NU", "KP", "PA", "QA", "RW", "KN", "LC", "ST", "SA",
  "SC", "SL", "SB", "SO", "ZA", "SR", "SY", "TZ", "TL", "TK",
  "TO", "TT", "TV", "UG", "AE", "VU", "YE", "ZW"
];

var countryOptions = [
  <option key="AF" value="AF">Afghanistan</option>,
  <option key="AL" value="AL">Albania</option>,
  <option key="DZ" value="DZ">Algeria</option>,
  <option key="AS" value="AS">American Samoa</option>,
  <option key="AD" value="AD">Andorra</option>,
  <option key="AO" value="AO">Angola</option>,
  <option key="AI" value="AI">Anguilla</option>,
  <option key="AG" value="AG">Antigua and Barbuda</option>,
  <option key="AR" value="AR">Argentina</option>,
  <option key="AM" value="AM">Armenia</option>,
  <option key="AW" value="AW">Aruba</option>,
  <option key="AU" value="AU">Australia</option>,
  <option key="AT" value="AT">Austria</option>,
  <option key="AZ" value="AZ">Azerbaijan</option>,
  <option key="BS" value="BS">Bahamas</option>,
  <option key="BH" value="BH">Bahrain</option>,
  <option key="BD" value="BD">Bangladesh</option>,
  <option key="BB" value="BB">Barbados</option>,
  <option key="BY" value="BY">Belarus</option>,
  <option key="BE" value="BE">Belgium</option>,
  <option key="BZ" value="BZ">Belize</option>,
  <option key="BJ" value="BJ">Benin</option>,
  <option key="BM" value="BM">Bermuda</option>,
  <option key="BT" value="BT">Bhutan</option>,
  <option key="BO" value="BO">Bolivia</option>,
  <option key="BA" value="BA">Bosnia and Herzegovina</option>,
  <option key="BW" value="BW">Botswana</option>,
  <option key="BR" value="BR">Brazil</option>,
  <option key="VG" value="VG">British Virgin Islands</option>,
  <option key="IO" value="IO">British Indian Ocean Territory</option>,
  <option key="BN" value="BN">Brunei</option>,
  <option key="BG" value="BG">Bulgaria</option>,
  <option key="BF" value="BF">Burkina Faso</option>,
  <option key="BI" value="BI">Burundi</option>,
  <option key="KH" value="KH">Cambodia</option>,
  <option key="CM" value="CM">Cameroon</option>,
  <option key="CA" value="CA">Canada</option>,
  <option key="CV" value="CV">Cape Verde</option>,
  <option key="KY" value="KY">Cayman Islands</option>,
  <option key="CF" value="CF">Central African Republic</option>,
  <option key="TD" value="TD">Chad</option>,
  <option key="CL" value="CL">Chile</option>,
  <option key="CN" value="CN">China</option>,
  <option key="CX" value="CX">Christmas Island</option>,
  <option key="CO" value="CO">Colombia</option>,
  <option key="KM" value="KM">Comoros Islands</option>,
  <option key="CD" value="CD">Congo, Democratic Republic of the</option>,
  <option key="CG" value="CG">Congo, Republic of the</option>,
  <option key="CK" value="CK">Cook Islands</option>,
  <option key="CR" value="CR">Costa Rica</option>,
  <option key="CI" value="CI">Cote D&#39;ivoire</option>,
  <option key="HR" value="HR">Croatia</option>,
  <option key="CY" value="CY">Cyprus</option>,
  <option key="CZ" value="CZ">Czech Republic</option>,
  <option key="DK" value="DK">Denmark</option>,
  <option key="DJ" value="DJ">Djibouti</option>,
  <option key="DM" value="DM">Dominica</option>,
  <option key="DO" value="DO">Dominican Republic</option>,
  <option key="TP" value="TP">East Timor</option>,
  <option key="EC" value="EC">Ecuador</option>,
  <option key="EG" value="EG">Egypt</option>,
  <option key="SV" value="SV">El Salvador</option>,
  <option key="GQ" value="GQ">Equatorial Guinea</option>,
  <option key="ER" value="ER">Eritrea</option>,
  <option key="EE" value="EE">Estonia</option>,
  <option key="ET" value="ET">Ethiopia</option>,
  <option key="FK" value="FK">Falkland Islands (Malvinas)</option>,
  <option key="FO" value="FO">Faroe Islands</option>,
  <option key="FJ" value="FJ">Fiji</option>,
  <option key="FI" value="FI">Finland</option>,
  <option key="FR" value="FR">France</option>,
  <option key="GF" value="GF">French Guiana</option>,
  <option key="PF" value="PF">French Polynesia</option>,
  <option key="TF" value="TF">French Southern Territories</option>,
  <option key="GA" value="GA">Gabon</option>,
  <option key="GM" value="GM">Gambia</option>,
  <option key="GE" value="GE">Georgia</option>,
  <option key="DE" value="DE">Germany</option>,
  <option key="GH" value="GH">Ghana</option>,
  <option key="GI" value="GI">Gibraltar</option>,
  <option key="GR" value="GR">Greece</option>,
  <option key="GL" value="GL">Greenland</option>,
  <option key="GD" value="GD">Grenada</option>,
  <option key="GP" value="GP">Guadeloupe</option>,
  <option key="GU" value="GU">Guam</option>,
  <option key="GT" value="GT">Guatemala</option>,
  <option key="GN" value="GN">Guinea</option>,
  <option key="GW" value="GW">Guinea-Bissau</option>,
  <option key="GY" value="GY">Guyana</option>,
  <option key="HT" value="HT">Haiti</option>,
  <option key="VA" value="VA">Holy See (Vatican City State)</option>,
  <option key="HN" value="HN">Honduras</option>,
  <option key="HK" value="HK">Hong Kong</option>,
  <option key="HU" value="HU">Hungary</option>,
  <option key="IS" value="IS">Iceland</option>,
  <option key="IN" value="IN">India</option>,
  <option key="ID" value="ID">Indonesia</option>,
  <option key="IQ" value="IQ">Iraq</option>,
  <option key="IE" value="IE">Republic of Ireland</option>,
  <option key="IL" value="IL">Israel</option>,
  <option key="IT" value="IT">Italy</option>,
  <option key="JM" value="JM">Jamaica</option>,
  <option key="JP" value="JP">Japan</option>,
  <option key="JO" value="JO">Jordan</option>,
  <option key="KZ" value="KZ">Kazakhstan</option>,
  <option key="KE" value="KE">Kenya</option>,
  <option key="KI" value="KI">Kiribati</option>,
  <option key="KR" value="KR">South Korea</option>,
  <option key="XK" value="XK">Kosovo</option>,
  <option key="KW" value="KW">Kuwait</option>,
  <option key="KG" value="KG">Kyrgyzstan</option>,
  <option key="LA" value="LA">Laos</option>,
  <option key="LV" value="LV">Latvia</option>,
  <option key="LB" value="LB">Lebanon</option>,
  <option key="LS" value="LS">Lesotho</option>,
  <option key="LR" value="LR">Liberia</option>,
  <option key="LY" value="LY">Libya</option>,
  <option key="LI" value="LI">Liechtenstein</option>,
  <option key="LT" value="LT">Lithuania</option>,
  <option key="LU" value="LU">Luxembourg</option>,
  <option key="MO" value="MO">Macau</option>,
  <option key="MK" value="MK">Macedonia</option>,
  <option key="MG" value="MG">Madagascar</option>,
  <option key="MW" value="MW">Malawi</option>,
  <option key="MY" value="MY">Malaysia</option>,
  <option key="MV" value="MV">Maldives</option>,
  <option key="ML" value="ML">Mali</option>,
  <option key="MT" value="MT">Malta</option>,
  <option key="MH" value="MH">Marshall Islands</option>,
  <option key="MQ" value="MQ">Martinique</option>,
  <option key="MR" value="MR">Mauritania</option>,
  <option key="MU" value="MU">Mauritius</option>,
  <option key="YT" value="YT">Mayotte</option>,
  <option key="MX" value="MX">Mexico</option>,
  <option key="FM" value="FM">Micronesia</option>,
  <option key="MD" value="MD">Moldova, Republic of</option>,
  <option key="MC" value="MC">Monaco</option>,
  <option key="MN" value="MN">Mongolia</option>,
  <option key="ME" value="ME">Montenegro</option>,
  <option key="MS" value="MS">Montserrat</option>,
  <option key="MA" value="MA">Morocco</option>,
  <option key="MZ" value="MZ">Mozambique</option>,
  <option key="MM" value="MM">Myanmar</option>,
  <option key="NA" value="NA">Namibia</option>,
  <option key="NR" value="NR">Nauru</option>,
  <option key="NP" value="NP">Nepal</option>,
  <option key="NL" value="NL">Netherlands</option>,
  <option key="AN" value="AN">Netherlands Antilles</option>,
  <option key="NC" value="NC">New Caledonia</option>,
  <option key="NZ" value="NZ">New Zealand</option>,
  <option key="NI" value="NI">Nicaragua</option>,
  <option key="NE" value="NE">Niger</option>,
  <option key="NG" value="NG">Nigeria</option>,
  <option key="NU" value="NU">Niue</option>,
  <option key="NF" value="NF">Norfolk Island</option>,
  <option key="MP" value="MP">Northern Mariana Islands</option>,
  <option key="NO" value="NO">Norway</option>,
  <option key="OM" value="OM">Oman</option>,
  <option key="PK" value="PK">Pakistan</option>,
  <option key="PW" value="PW">Palau</option>,
  <option key="PA" value="PA">Panama</option>,
  <option key="PG" value="PG">Papua New Guinea</option>,
  <option key="PY" value="PY">Paraguay</option>,
  <option key="PE" value="PE">Peru</option>,
  <option key="PH" value="PH">Philippines</option>,
  <option key="PN" value="PN">Pitcairn Island</option>,
  <option key="PL" value="PL">Poland</option>,
  <option key="PT" value="PT">Portugal</option>,
  <option key="PR" value="PR">Puerto Rico</option>,
  <option key="QA" value="QA">Qatar</option>,
  <option key="RE" value="RE">Reunion</option>,
  <option key="RO" value="RO">Romania</option>,
  <option key="RU" value="RU">Russian Federation</option>,
  <option key="RW" value="RW">Rwanda</option>,
  <option key="KN" value="KN">Saint Kitts and Nevis</option>,
  <option key="LC" value="LC">Saint Lucia</option>,
  <option key="VC" value="VC">Saint Vincent and the Grenadines</option>,
  <option key="WS" value="WS">Samoa</option>,
  <option key="SM" value="SM">San Marino</option>,
  <option key="ST" value="ST">Sao Tome and Principe</option>,
  <option key="SA" value="SA">Saudi Arabia</option>,
  <option key="SN" value="SN">Senegal</option>,
  <option key="RS" value="RS">Serbia</option>,
  <option key="SC" value="SC">Seychelles</option>,
  <option key="SL" value="SL">Sierra Leone</option>,
  <option key="SG" value="SG">Singapore</option>,
  <option key="SK" value="SK">Slovakia</option>,
  <option key="SI" value="SI">Slovenia</option>,
  <option key="SB" value="SB">Solomon Islands</option>,
  <option key="SO" value="SO">Somalia</option>,
  <option key="ZA" value="ZA">South Africa</option>,
  <option key="SS" value="SS">South Sudan</option>,
  <option key="ES" value="ES">Spain</option>,
  <option key="LK" value="LK">Sri Lanka</option>,
  <option key="SH" value="SH">St. Helena</option>,
  <option key="PM" value="PM">St. Pierre and Miquelon</option>,
  <option key="SR" value="SR">Suriname</option>,
  <option key="SZ" value="SZ">Swaziland</option>,
  <option key="SE" value="SE">Sweden</option>,
  <option key="CH" value="CH">Switzerland</option>,
  <option key="TW" value="TW">Taiwan</option>,
  <option key="TJ" value="TJ">Tajikistan</option>,
  <option key="TZ" value="TZ">Tanzania</option>,
  <option key="TH" value="TH">Thailand</option>,
  <option key="TG" value="TG">Togo</option>,
  <option key="TK" value="TK">Tokelau</option>,
  <option key="TO" value="TO">Tonga</option>,
  <option key="TT" value="TT">Trinidad and Tobago</option>,
  <option key="TN" value="TN">Tunisia</option>,
  <option key="TR" value="TR">Turkey</option>,
  <option key="TM" value="TM">Turkmenistan</option>,
  <option key="TC" value="TC">Turks and Caicos Islands</option>,
  <option key="TV" value="TV">Tuvalu</option>,
  <option key="UG" value="UG">Uganda</option>,
  <option key="UA" value="UA">Ukraine</option>,
  <option key="AE" value="AE">United Arab Emirates</option>,
  <option key="GB" value="GB">United Kingdom</option>,
  <option key="US" value="US">United States</option>,
  <option key="UY" value="UY">Uruguay</option>,
  <option key="UZ" value="UZ">Uzbekistan</option>,
  <option key="VU" value="VU">Vanuatu</option>,
  <option key="VE" value="VE">Venezuela</option>,
  <option key="VN" value="VN">Viet Nam</option>,
  <option key="VI" value="VI">Virgin Islands (U.S.)</option>,
  <option key="WF" value="WF">Wallis and Futuna Islands</option>,
  <option key="EH" value="EH">Western Sahara</option>,
  <option key="YE" value="YE">Yemen</option>,
  <option key="ZM" value="ZM">Zambia</option>,
  <option key="ZW" value="ZW">Zimbabwe</option>
];

var usStates = [
  <option key="AL" value="AL">Alabama</option>,
  <option key="AK" value="AK">Alaska</option>,
  <option key="AS" value="AS">American Samoa</option>,
  <option key="AZ" value="AZ">Arizona</option>,
  <option key="AR" value="AR">Arkansas</option>,
  <option key="AA" value="AA">Armed Forces Americas</option>,
  <option key="AE" value="AE">Armed Forces Europe</option>,
  <option key="AP" value="AP">Armed Forces Pacific</option>,
  <option key="CA" value="CA">California</option>,
  <option key="CO" value="CO">Colorado</option>,
  <option key="CT" value="CT">Connecticut</option>,
  <option key="DE" value="DE">Delaware</option>,
  <option key="DC" value="DC">District of Columbia</option>,
  <option key="FL" value="FL">Florida</option>,
  <option key="GA" value="GA">Georgia</option>,
  <option key="GU" value="GU">Guam</option>,
  <option key="HI" value="HI">Hawaii</option>,
  <option key="ID" value="ID">Idaho</option>,
  <option key="IL" value="IL">Illinois</option>,
  <option key="IN" value="IN">Indiana</option>,
  <option key="IA" value="IA">Iowa</option>,
  <option key="KS" value="KS">Kansas</option>,
  <option key="KY" value="KY">Kentucky</option>,
  <option key="LA" value="LA">Louisiana</option>,
  <option key="ME" value="ME">Maine</option>,
  <option key="MH" value="MH">Marshall Islands</option>,
  <option key="MD" value="MD">Maryland</option>,
  <option key="MA" value="MA">Massachusetts</option>,
  <option key="MI" value="MI">Michigan</option>,
  <option key="FM" value="FM">Micronesia</option>,
  <option key="MN" value="MN">Minnesota</option>,
  <option key="UM" value="UM">Minor Outlying Islands</option>,
  <option key="MS" value="MS">Mississippi</option>,
  <option key="MO" value="MO">Missouri</option>,
  <option key="MT" value="MT">Montana</option>,
  <option key="NE" value="NE">Nebraska</option>,
  <option key="NV" value="NV">Nevada</option>,
  <option key="NH" value="NH">New Hampshire</option>,
  <option key="NJ" value="NJ">New Jersey</option>,
  <option key="NM" value="NM">New Mexico</option>,
  <option key="NY" value="NY">New York</option>,
  <option key="NC" value="NC">North Carolina</option>,
  <option key="ND" value="ND">North Dakota</option>,
  <option key="MP" value="MP">Northern Mariana Islands</option>,
  <option key="OH" value="OH">Ohio</option>,
  <option key="OK" value="OK">Oklahoma</option>,
  <option key="OR" value="OR">Oregon</option>,
  <option key="PW" value="PW">Palau</option>,
  <option key="PA" value="PA">Pennsylvania</option>,
  <option key="PR" value="PR">Puerto Rico</option>,
  <option key="RI" value="RI">Rhode Island</option>,
  <option key="SC" value="SC">South Carolina</option>,
  <option key="SD" value="SD">South Dakota</option>,
  <option key="TN" value="TN">Tennessee</option>,
  <option key="TX" value="TX">Texas</option>,
  <option key="UT" value="UT">Utah</option>,
  <option key="VT" value="VT">Vermont</option>,
  <option key="VI" value="VI">Virgin Islands</option>,
  <option key="VA" value="VA">Virginia</option>,
  <option key="WA" value="WA">Washington</option>,
  <option key="WV" value="WV">West Virginia</option>,
  <option key="WI" value="WI">Wisconsin</option>,
  <option key="WY" value="WY">Wyoming</option>
];

var australianStates = [
  <option key="Australian Capital Territory" value="Australian Capital Territory">Australian Capital Territory</option>,
  <option key="New South Wales" value="New South Wales">New South Wales</option>,
  <option key="Northern Territory" value="Northern Territory">Northern Territory</option>,
  <option key="Queensland" value="Queensland">Queensland</option>,
  <option key="South Australia" value="South Australia">South Australia</option>,
  <option key="Tasmania" value="Tasmania">Tasmania</option>,
  <option key="Victoria" value="Victoria">Victoria</option>,
  <option key="Western Australia" value="Western Australia">Western Australia</option>
];

var brazilianStates = [
  <option key="AC" value="AC">Acre</option>,
  <option key="AL" value="AL">Alagoas</option>,
  <option key="AM" value="AM">Amazonas</option>,
  <option key="AP" value="AP">Amapá</option>,
  <option key="BA" value="BA">Bahia</option>,
  <option key="CE" value="CE">Ceará</option>,
  <option key="DF" value="DF">Distrito Federal</option>,
  <option key="ES" value="ES">Espírito Santo</option>,
  <option key="GO" value="GO">Goiás</option>,
  <option key="MA" value="MA">Maranhão</option>,
  <option key="MT" value="MT">Mato Grosso</option>,
  <option key="MS" value="MS">Mato Grosso do Sul</option>,
  <option key="MG" value="MG">Minas Gerais</option>,
  <option key="PA" value="PA">Pará</option>,
  <option key="PB" value="PB">Paraíba</option>,
  <option key="PR" value="PR">Paraná</option>,
  <option key="PE" value="PE">Pernambuco</option>,
  <option key="PI" value="PI">Piauí</option>,
  <option key="RJ" value="RJ">Rio de Janeiro</option>,
  <option key="RN" value="RN">Rio Grande do Norte</option>,
  <option key="RO" value="RO">Rondônia</option>,
  <option key="RS" value="RS">Rio Grande do Sul</option>,
  <option key="RR" value="RR">Roraima</option>,
  <option key="SC" value="SC">Santa Catarina</option>,
  <option key="SE" value="SE">Sergipe</option>,
  <option key="SP" value="SP">São Paulo</option>,
  <option key="TO" value="TO">Tocantins</option>
];

var canadianProvinces = [
  <option key="Alberta" value="Alberta">Alberta</option>,
  <option key="British Columbia" value="British Columbia">British Columbia</option>,
  <option key="Manitoba" value="Manitoba">Manitoba</option>,
  <option key="New Brunswick" value="New Brunswick">New Brunswick</option>,
  <option key="Newfoundland and Labrador" value="Newfoundland and Labrador">Newfoundland and Labrador</option>,
  <option key="Northwest Territories" value="Northwest Territories">Northwest Territories</option>,
  <option key="Nova Scotia" value="Nova Scotia">Nova Scotia</option>,
  <option key="Nunavut" value="Nunavut">Nunavut</option>,
  <option key="Ontario" value="Ontario">Ontario</option>,
  <option key="Prince Edward Island" value="Prince Edward Island">Prince Edward Island</option>,
  <option key="Quebec" value="Quebec">Quebec</option>,
  <option key="Saskatchewan" value="Saskatchewan">Saskatchewan</option>,
  <option key="Yukon" value="Yukon">Yukon</option>
];

var irishCounties = [
  <option key="Antrim" value="Antrim">Antrim</option>,
  <option key="Armagh" value="Armagh">Armagh</option>,
  <option key="Carlow" value="Carlow">Carlow</option>,
  <option key="Cavan" value="Cavan">Cavan</option>,
  <option key="Clare" value="Clare">Clare</option>,
  <option key="Cork" value="Cork">Cork</option>,
  <option key="Derry" value="Derry">Derry</option>,
  <option key="Donegal" value="Donegal">Donegal</option>,
  <option key="Down" value="Down">Down</option>,
  <option key="Dublin" value="Dublin">Dublin</option>,
  <option key="Fermanagh" value="Fermanagh">Fermanagh</option>,
  <option key="Galway" value="Galway">Galway</option>,
  <option key="Kerry" value="Kerry">Kerry</option>,
  <option key="Kildare" value="Kildare">Kildare</option>,
  <option key="Kilkenny" value="Kilkenny">Kilkenny</option>,
  <option key="Laois" value="Laois">Laois</option>,
  <option key="Leitrim" value="Leitrim">Leitrim</option>,
  <option key="Limerick" value="Limerick">Limerick</option>,
  <option key="Longford" value="Longford">Longford</option>,
  <option key="Louth" value="Louth">Louth</option>,
  <option key="Mayo" value="Mayo">Mayo</option>,
  <option key="Meath" value="Meath">Meath</option>,
  <option key="Monaghan" value="Monaghan">Monaghan</option>,
  <option key="Offaly" value="Offaly">Offaly</option>,
  <option key="Roscommon" value="Roscommon">Roscommon</option>,
  <option key="Sligo" value="Sligo">Sligo</option>,
  <option key="Tipperary" value="Tipperary">Tipperary</option>,
  <option key="Tyrone" value="Tyrone">Tyrone</option>,
  <option key="Waterford" value="Waterford">Waterford</option>,
  <option key="Westmeath" value="Westmeath">Westmeath</option>,
  <option key="Wexford" value="Wexford">Wexford</option>,
  <option key="Wicklow" value="Wicklow">Wicklow</option>
];

var mexicanStates = [
  <option key="Aguascalientes" value="Aguascalientes">Aguascalientes</option>,
  <option key="Baja California Norte" value="Baja California Norte">Baja California Norte</option>,
  <option key="Baja California Sur" value="Baja California Sur">Baja California Sur</option>,
  <option key="Campeche" value="Campeche">Campeche</option>,
  <option key="Chiapas" value="Chiapas">Chiapas</option>,
  <option key="Chihuahua" value="Chihuahua">Chihuahua</option>,
  <option key="Coahuila" value="Coahuila">Coahuila</option>,
  <option key="Colima" value="Colima">Colima</option>,
  <option key="Distrito Federal" value="Distrito Federal">Distrito Federal</option>,
  <option key="Durango" value="Durango">Durango</option>,
  <option key="Guanajuato" value="Guanajuato">Guanajuato</option>,
  <option key="Guerrero" value="Guerrero">Guerrero</option>,
  <option key="Hidalgo" value="Hidalgo">Hidalgo</option>,
  <option key="Jalisco" value="Jalisco">Jalisco</option>,
  <option key="Mexico (Estado de)" value="Mexico (Estado de)">Mexico (Estado de)</option>,
  <option key="Michoacan" value="Michoacan">Michoacan</option>,
  <option key="Morelos" value="Morelos">Morelos</option>,
  <option key="Nayarit" value="Nayarit">Nayarit</option>,
  <option key="Nuevo Leon" value="Nuevo Leon">Nuevo Leon</option>,
  <option key="Oaxaca" value="Oaxaca">Oaxaca</option>,
  <option key="Puebla" value="Puebla">Puebla</option>,
  <option key="Queretaro" value="Queretaro">Queretaro</option>,
  <option key="Quintana Roo" value="Quintana Roo">Quintana Roo</option>,
  <option key="San Luis Potosi" value="San Luis Potosi">San Luis Potosi</option>,
  <option key="Sinaloa" value="Sinaloa">Sinaloa</option>,
  <option key="Sonora" value="Sonora">Sonora</option>,
  <option key="Tabasco" value="Tabasco">Tabasco</option>,
  <option key="Tamaulipas" value="Tamaulipas">Tamaulipas</option>,
  <option key="Tlaxcala" value="Tlaxcala">Tlaxcala</option>,
  <option key="Veracruz" value="Veracruz">Veracruz</option>,
  <option key="Yucatan" value="Yucatan">Yucatan</option>,
  <option key="Zacatecas" value="Zacatecas">Zacatecas</option>
];

var swedishProvinces = [
  <option key="Blekinge" value="Blekinge">Blekinge</option>,
  <option key="Dalarna" value="Dalarna">Dalarna</option>,
  <option key="Gavleborg" value="Gavleborg">Gavleborg</option>,
  <option key="Gotland" value="Gotland">Gotland</option>,
  <option key="Halland" value="Halland">Halland</option>,
  <option key="Jamtland" value="Jamtland">Jamtland</option>,
  <option key="Jonkoping" value="Jonkoping">Jonkoping</option>,
  <option key="Kalmar" value="Kalmar">Kalmar</option>,
  <option key="Kronoberg" value="Kronoberg">Kronoberg</option>,
  <option key="Norrbotten" value="Norrbotten">Norrbotten</option>,
  <option key="Orebro" value="Orebro">Orebro</option>,
  <option key="Ostergotland" value="Ostergotland">Ostergotland</option>,
  <option key="Skane" value="Skane">Skane</option>,
  <option key="Sodermanland" value="Sodermanland">Sodermanland</option>,
  <option key="Stockholm" value="Stockholm">Stockholm</option>,
  <option key="Uppsala" value="Uppsala">Uppsala</option>,
  <option key="Varmland" value="Varmland">Varmland</option>,
  <option key="Vasterbotten" value="Vasterbotten">Vasterbotten</option>,
  <option key="Vasternorrland" value="Vasternorrland">Vasternorrland</option>,
  <option key="Vastmanland" value="Vastmanland">Vastmanland</option>,
  <option key="Vastra Gotaland" value="Vastra Gotaland">Vastra Gotaland</option>
];

var southAfricanProvinces = [
  <option key="Eastern Cape" value="Eastern Cape">Eastern Cape</option>,
  <option key="Free State" value="Free State">Free State</option>,
  <option key="Gauteng" value="Gauteng">Gauteng</option>,
  <option key="KwaZulu-Natal" value="KwaZulu-Natal">KwaZulu-Natal</option>,
  <option key="Limpopo" value="Limpopo">Limpopo</option>,
  <option key="Mpumalanga" value="Mpumalanga">Mpumalanga</option>,
  <option key="North West" value="North West">North West</option>,
  <option key="Northern Cape" value="Northern Cape">Northern Cape</option>,
  <option key="Western Cape" value="Western Cape">Western Cape</option>
];

var CountrySelect = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    country: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    className: React.PropTypes.string.isRequired,
    onCountryChange: React.PropTypes.func.isRequired
  },
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
        <select onChange={this.props.onCountryChange} name={this.props.name} value={this.props.country} className={countryClassName}>
          <option value="">{this.getIntlMessage('country')}</option>
          {countryOptions}
        </select>
      </div>
    );
  }
});

var ProvinceSelect = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    province: React.PropTypes.string.isRequired,
    country: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    className: React.PropTypes.string.isRequired,
    onProvinceChange: React.PropTypes.func.isRequired
  },
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
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="U.S. States and Territories">
            {usStates}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "AU") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Australian States">
            {australianStates}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "BR") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Brazilian States">
            {brazilianStates}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "CA") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Canadian Provinces">
            {canadianProvinces}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "IE") {
      return (
        <select ref="provinceSelect" onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Irish Counties">
            {irishCounties}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "MX") {
      return (
        <select onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Mexican States">
            {mexicanStates}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "ZA") {
      return (
        <select onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="South African Provinces">
            {southAfricanProvinces}
          </optgroup>
        </select>
      );
    } else if (this.props.country === "SE") {
      return (
        <select onChange={this.props.onProvinceChange} name={this.props.name} value={this.props.province} id="wsstate_cd" className={provinceClassName}>
          <option value="">{this.getIntlMessage('state_province')}</option>
          <optgroup label="Swedish Provinces">
            {swedishProvinces}
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
    name: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      valid: true,
      country: ""
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: "country"
    });
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "country") {
      this.setState({
        country: detail.value
      });
    }
  },
  onCountryChange: function(e) {
    this.setState({
      valid: true
    });
    // Changing the country should clear any errors on province.
    form.error("province", "");
    form.updateField("country", e.currentTarget.value);
  },
  validate: function() {
    var valid = true;
    if (!this.refs.countrySelect.validate()) {
      valid = false;
      form.error("country", this.getIntlMessage("please_complete"));
      this.setState({
        valid: valid
      });
    }
    return valid;
  },
  render: function() {
    var className = "";
    if (!this.state.valid) {
      className += " parsley-error";
    }
    return (
      <CountrySelect ref="countrySelect" name={this.props.name} country={this.state.country} onCountryChange={this.onCountryChange} className={className}/>
    );
  }
});

var Province = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      valid: true,
      country: "",
      province: ""
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: "province"
    });
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "province") {
      this.setState({
        province: detail.value
      });
    } else if (detail.field === "country") {
      this.setState({
        country: detail.value
      });
    }
  },
  onProvinceChange: function(e) {
    this.setState({
      valid: true
    });
    form.updateField("province", e.currentTarget.value);
  },
  validate: function() {
    var valid = true;
    if (!this.refs.provinceSelect.validate()) {
      valid = false;
      form.error("province", this.getIntlMessage("please_complete"));
      this.setState({
        valid: valid
      });
    }
    return valid;
  },
  render: function() {
    var className = "";
    if (!this.state.valid) {
      className += " parsley-error";
    }
    return (
      <ProvinceSelect ref="provinceSelect" name={this.props.name} country={this.state.country} onProvinceChange={this.onProvinceChange} className={className} province={this.state.province}/>
    );
  }
});

var Code = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      disabled: false
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    var disabled = false;

    if (detail.field !== "country") {
      return;
    }

    if (COUNTRIES_WITHOUT_POSTCODES.includes(detail.value)) {
      disabled = true;
    }

    this.setState({
      disabled
    });
    dispatcher.fire('toggleCode', {
      disabled
    });
  },
  mixins: [IntlMixin],
  render: function() {
    return (
      <Input
        {...this.props}
        placeholder={this.getIntlMessage('postal_code')}
        disabled={this.state.disabled}
        field="code"
      />
    );
  }
});

var City = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  mixins: [IntlMixin],
  render: function() {
    return (
      <Input
        {...this.props}
        placeholder={this.getIntlMessage('city')}
        field="city"
      />
    );
  }
});

var Address = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  mixins: [IntlMixin],
  render: function() {
    return (
      <Input
        {...this.props}
        placeholder={this.getIntlMessage('address')}
        field="address"
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
