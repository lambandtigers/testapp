/* eslint-env jquery, web3 */
import React from 'react'
import { Link } from 'react-router'
import { Persona } from 'uport-lib'

const Connect = React.createClass({

  propTypes: {
    web3: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      address: null,
      error: null,
      personaAttributes: null
    }
  },
  componentDidUpdate: function () {
    let self = this

    if (this.state.address && !this.state.personaAttributes) {
      let ipfsProvider = {
        host: 'ipfs.infura.io',
        port: '5001',
        protocol: 'https',
        root: ''
      }

      let persona = new Persona(this.state.address, ipfsProvider, this.props.web3.currentProvider)

      persona.load().then(() => {
        let profile = persona.getProfile()
        self.setState({ personaAttributes: profile })
        $('#attributeName').text(profile.name)
        if (profile.image[0].contentUrl !== undefined) {
          let imgUrl = 'https://ipfs.infura.io' + profile.image[0].contentUrl
          $('#avatarImg').attr('src', imgUrl)
          $('#avatarDiv').show()
        }
        if (profile.description !== undefined) {
          $('#attributeDescriptionRow').show()
          $('#attributeDescription').text(profile.description)
        }

        if (profile.location !== undefined) {
          $('#attributeLocationRow').show()
          $('#attributeLocation').text(profile.location)
        }
      })
      $('#connect').hide()
      $('#address').text(this.state.address)
      $('#success').show()
    }
    if (this.state.error) {
      $('#connect').hide()
      $('#error').text(this.state.error)
      $('#errorDiv').show()
    }
  },
  connect: function () {
    let self = this
    this.props.web3.eth.getCoinbase(function (error, address) {
      if (error) { throw error }
      self.props.web3.eth.defaultAccount = address
      self.setState({address: address})
    })
  },
  render: function () {
    let attributesTable = (
      <table style={{color: '#fff'}}>
        <tbody>
          <tr>
            <td style={{textAlign: 'right'}}><strong>uPort Id:</strong></td>
            <td><span id='address' /></td>
          </tr>
          <tr>
            <td style={{textAlign: 'right'}}><strong>Name:</strong></td>
            <td><span id='attributeName' /></td>
          </tr>
          <tr id='attributeDescriptionRow' style={{display: 'none'}}>
            <td style={{textAlign: 'right'}}><strong>I am:</strong></td>
            <td><span id='attributeDescription' /></td>
          </tr>
          <tr id='attributeLocationRow' style={{display: 'none'}}>
            <td style={{textAlign: 'right'}}><strong>Location:</strong></td>
            <td><span id='attributeLocation' /></td>
          </tr>
        </tbody>
      </table>
    )

    return (
      <div className='container centered' style={{maxWidth: '480px'}}>
        <Link to='/'>
          <img className='main-logo' src='img/uPort-logo.svg' alt='uPort'
            title='uPort Logo'
            style={{maxWidth: '90px', margin: '20px auto 40px', display: 'block'}} />
        </Link>
        <div id='connect'>
          <button className='btn bigger' onClick={this.connect} type='submit'>Connect uPort</button>
        </div>
        <div id='success' style={{display: 'none'}}>
          <h3>Success! You have connected your uPort identity.</h3>
          <table className='persona'>
            <tbody>
              <tr>
                <td className='avatar'>
                  <div id='avatarDiv' style={{display: 'none'}}>
                    <img id='avatarImg' style={{maxWidth: '200px'}} />
                  </div>
                </td>
                <td>{attributesTable}</td>
              </tr>
            </tbody>
          </table>
          <Link to='sign'>
            <button className='btn bigger' type='submit'>Continue</button>
          </Link>
        </div>
        <div id='errorDiv' style={{display: 'none'}}>
          <h3>Error! You have NOT connected your uPort identity.</h3>
          <p><strong>Error:</strong><span id='error' style={{display: 'inline-block', marginLeft: '10px'}} /> </p>
        </div>
      </div>
    )
  }
})

export default Connect
