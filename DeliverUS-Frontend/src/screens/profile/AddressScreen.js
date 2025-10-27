import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'
import {AuthorizationContext} from '../../context/AuthorizationContext'

export default function AddressScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([])
  const [addressToBeDeleted, setAddressToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    if (loggedInUser) {
      fetchAddresses()
    } else {
      setAddresses(null)
    }
  }, [loggedInUser, route])

  const fetchAddresses = async () => {
    try {
      const fetchedAddresses = await getAddresses()
      setAddresses(fetchedAddresses)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving addresses. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  } 

  const defaultAddress = async (address) => {
    try {
      await setDefault(address.id)
      await fetchAddresses()
      showMessage({
        message: `Process succesfully completed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      showMessage({
        message: `There was an error`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const removeAddress = async (address) => {
    try {
      await deleteAddress(address.id)
      await fetchAddresses()
      setAddressToBeDeleted(null)
      showMessage({
        message: `Address ${address.alias} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setAddressToBeDeleted(null)
      showMessage({
        message: `Address ${address.alias} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderAddress = ({item}) => {
    return(
      <View style={{flex:1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#ddd', alignItems: 'center'}}>
          <TextSemiBold>{item.alias}</TextSemiBold>
          <TextRegular>{item.street},{item.city},{item.province},{item.zipCode}</TextRegular>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              onPress={() => { defaultAddress(item) }}
              style={{padding: 6}}
            >
              <Ionicons 
                name={item.isDefault ? 'star' : 'star-outline'}
                color={brandPrimary}
                size={24}
              /> 
            </Pressable>

            <Pressable
              onPress={() => { setAddressToBeDeleted(item) }}
              style={{padding: 6}}
            >
              <Ionicons 
                name='trash'
                color={brandPrimaryTap}
                size={24}
              /> 
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  const renderEmptyAddressesList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No addresses were retreived. Are you logged in?
      </TextRegular>
    )
  }

  return (
    <View style={{flex:1}}>
    <TextSemiBold textStyle={{fontSize: 20, marginBottom: 10}}> Mis Direcciones </TextSemiBold>
    <FlatList
      data={addresses}
      renderItem={renderAddress}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={renderEmptyAddressesList}
    />
    <DeleteModal
      isVisible={addressToBeDeleted !== null}
      onCancel={() => setAddressToBeDeleted(null)}
      onConfirm={() => removeAddress(addressToBeDeleted)}>
      <TextRegular>¿Seguro que quieres eliminar esta dirección?</TextRegular>
    </DeleteModal>
    <Pressable
      onPress={() => navigation.navigate('AddressDetailScreen')}
      style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? brandPrimaryTap
              : brandPrimary
          },
          styles.actionButton
        ]}>
          <TextRegular style={styles.buttonText}>Añadir nueva dirección</TextRegular>
    </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '90%'
  },
  buttonText: { 
    color: brandSecondary,
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
  ,
})
