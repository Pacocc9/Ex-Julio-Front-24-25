import React, {useState} from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Switch, TextRegular } from 'react-native' //NOTESE EL USO DE SWITCH
import { Formik } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextSemibold from '../../components/TextSemibold'
import { addAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryTap, brandSuccessDisabled, brandSuccess, brandSuccessTap } from '../../styles/GlobalStyles'
import * as GlobalStyles from '../../styles/GlobalStyles'

export default function AddressDetailScreen({ navigation}) {
  const [backendErrors, setBackendErrors] = useState() 
  
  const initialAddressScreen = { alias: null, street: null, city: null, province: null, zipcode: null, isDefault: null }
  const validationSchema = yup.object().shape({
    alias: yup
      .string()
      .max(255, 'Alias muy largo')
      .required('El alias es obligatorio'),
    street: yup
      .string()
      .max(255, 'Calle muy larga')
      .required('la calle es obligatoria'),
    city: yup
      .string()
      .max(255, 'Ciudad muy larga')
      .required('La ciudad es obligatoria'),
    province: yup
      .string()
      .max(255, 'Provincia muy larga')
      .required('La provincia es obligatoria'),
    zipCode: yup
      .string()
      .matches(/^[0-9]{5}$/, 'Código postal debe tener 5 dígitos')
      .required('El código postal es obligatorio')
  })

  const createAddress = async (values) => {
    setBackendErrors([])
    try {
      const createdAddress = await addAddress(values)
      showMessage({
        message: `Address ${createdAddress.alias} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('AddressScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
      initialValues={initialAddressScreen}
      validationSchema={validationSchema}
      onSubmit={createAddress}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              <TextSemibold style={styles.title}>Nueva dirección</TextSemibold>
                  <InputItem
                    name='alias'
                    label='Alias'
                    placeholder='Casa, Trabajo...'
                  />
                  <InputItem
                    name='street'
                    label='Calle'
                    placeholder='Ej: Mejos 1'
                  />
                  <InputItem
                    name='city'
                    label='Ciudad'
                    placeholder='Ej: Dos Hermanas'
                  />
                  <InputItem
                    name='province'
                    label='Province'
                    placeholder='Ej: Sevilla'
                  />
                  <InputItem
                    name='zipCode'
                    label='Código Postal'
                    placeholder='41700'
                  />
                  <View style={styles.toggleContainer}>
                    <TextSemibold textStyle={styles.toggleLabel}>Dirección predeterminada</TextSemibold>
                    <Switch
                      trackColor={{ false: '#ccc', true: brandPrimary}}
                      thumbColor={values.isDefault ? brandPrimaryTap : brandSuccessDisabled}
                      value={values.isDefault}
                      onValueChange={value =>
                        setFieldValue('isDefault', value)
                      }
                    />
                  </View>

                  {backendErrors &&
                    backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
                  }

                  <Pressable
                    onPress={handleSubmit}
                    disabled={!isValid}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed
                          ? brandSuccessTap
                          : brandSuccess
                      },
                      styles.button,
                      !isValid && { backgroundColor: brandSuccessDisabled }
                    ]}>
                    <TextSemibold textStyle={styles.buttonText}>Guardar dirección</TextSemibold>
                  </Pressable>
                </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  toggleContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginTop: 20,
 },
 toggleLabel: {
   fontSize: 16,
 },
})
