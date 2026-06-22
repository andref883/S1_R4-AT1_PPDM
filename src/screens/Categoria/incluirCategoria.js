import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { endpoints, logApiError } from '../../api/api';

export default function CategoriaScreenIncluir() {
  const navigation = useNavigation();
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const nome = nomeCategoria.trim();

    if (nome.length < 3) {
      Alert.alert('Atencao', 'Informe corretamente o nome da categoria.');
      return;
    }

    try {
      setSalvando(true);
      await endpoints.categorias.criar({ nome });
      Alert.alert('Sucesso', 'Categoria incluida.');
      navigation.goBack();
    } catch (error) {
      logApiError('Incluir categoria', error);
      Alert.alert('Erro', 'Nao foi possivel incluir a categoria.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Incluir Categoria</Text>
      <StatusBar style="auto" />

      <TextInput
        placeholder="Digite o nome da categoria"
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()} disabled={salvando}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton, salvando && styles.disabledButton]} onPress={salvar} disabled={salvando}>
          <Text style={{ color: '#fff' }}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  titulo: { marginTop: 25, marginBottom: 25, fontSize: 16, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 16, width: '95%' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  button: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8 },
  cancelButton: { backgroundColor: '#eee' },
  saveButton: { backgroundColor: '#4CAF50' },
  disabledButton: { opacity: 0.7 },
});