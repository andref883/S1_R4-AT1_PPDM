import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { endpoints, getList, logApiError } from '../../api/api';

function getCategoriaId(item) {
  return item?.Id ?? item?.id ?? item?.CategoriaId ?? item?.categoriaId;
}

function getCategoriaNome(item) {
  return item?.Nome ?? item?.nome ?? item?.NomeCategoria ?? item?.nomeCategoria;
}

export default function ProdutoScreenIncluir() {
  const navigation = useNavigation();
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      const response = await endpoints.categorias.listar();
      setCategorias(getList(response.data));
    } catch (error) {
      logApiError('Carregar categorias', error);
      Alert.alert('Erro', 'Nao foi possivel carregar as categorias.');
    }
  }

  async function salvar() {
    const nome = nomeProduto.trim();
    const valor = Number(String(valorProduto).replace(',', '.'));

    if (nome.length < 3) {
      Alert.alert('Atencao', 'Informe corretamente o nome do produto.');
      return;
    }

    if (!categoriaId) {
      Alert.alert('Atencao', 'Selecione uma categoria.');
      return;
    }

    if (!valor || valor <= 0) {
      Alert.alert('Atencao', 'Informe um valor valido.');
      return;
    }

    try {
      setSalvando(true);
      await endpoints.produtos.criar({ nome, valor, idCategoria: categoriaId });
      Alert.alert('Sucesso', 'Produto incluido.');
      navigation.goBack();
    } catch (error) {
      logApiError('Incluir produto', error);
      Alert.alert('Erro', 'Nao foi possivel incluir o produto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Incluir Produto</Text>
      <StatusBar style="auto" />

      <TextInput
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite valor do produto"
        value={valorProduto}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9,.]/g, '').replace(',', '.');
          const parts = cleaned.split('.');
          if (parts.length > 2) return;
          setValorProduto(cleaned);
        }}
      />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={categoriaId} onValueChange={(itemValue) => setCategoriaId(itemValue)} style={styles.picker}>
          <Picker.Item label="Selecione uma categoria" value={null} />
          {categorias.map((cat) => (
            <Picker.Item key={getCategoriaId(cat)} label={getCategoriaNome(cat)} value={getCategoriaId(cat)} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()} disabled={salvando}>
        <Text style={styles.textButton}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.saveButton, salvando && styles.disabledButton]} onPress={salvar} disabled={salvando}>
        <Text style={[styles.textButton, { color: '#fff' }]}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  titulo: { marginTop: 25, marginBottom: 25, fontSize: 16, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 16, width: '95%', height: 50 },
  button: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8, width: '95%', height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  cancelButton: { backgroundColor: '#eee' },
  saveButton: { backgroundColor: '#4CAF50' },
  disabledButton: { opacity: 0.7 },
  pickerContainer: { width: '95%', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginBottom: 16 },
  picker: { height: 50 },
  textButton: { fontSize: 16 },
});