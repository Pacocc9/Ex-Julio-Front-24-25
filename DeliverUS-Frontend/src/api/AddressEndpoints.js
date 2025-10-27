import { get, post, patch, destroy } from './helpers/ApiRequestsHelper'

function getAddresses () {
  return get('/shippingAddresses')
}

function addAddress (data) {
  return post('/shippingAddresses', data)
}

function setDefault (id) {
  return patch(`/shippingAddresses/${id}/default`)
}

function deleteAddress (id) {
  return destroy(`/shippingAddresses/${id}`)
}

export { getAddresses, addAddress, setDefault, deleteAddress }
