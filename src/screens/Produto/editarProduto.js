import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { endpoints, getList, logApiError } from '../../api/api';

function getId(item) {
  return item?.Id ?? item?.id ?? item?.ProdutoId ?? item?.produtoId;
}

function getNome(item) {
  return item?.NomeProduto ?? item?.nomeProduto ?? item?.Nome ?? item?.nome;
}

function getValor(item) {
  return item?.Valor ?? item?.valor ?? item?.Preco ?? item?.preco;
}

function getProdutoCategoriaId(item) {
  return item?.CategoriaId ?? item?.categoriaId ?? item?.IdCategoria ?? item?.idCategoria ?? item?.Categoria?.Id;
}

function getProdutoCategoriaNome(item) {
  return item?.NomeCategoria ?? item?.nomeCategoria ?? item?.Categoria?.Nome;
}

function getCategoriaId(item) {
  return item?.Id ?? item?.id ?? item?.CategoriaId ?? item?.categoriaId;
}

function getCategoriaNome(item) {
  return item?.Nome ?? item?.nome ?? item?.NomeCategoria ?? item?.nomeCategoria;
}

export default function ProdutoScreenEditar() {
  const navigation = useNavigation();
  const route = useRoute();
  const [idProduto, setIdProduto] = useState(null);
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    if (route.params) {
      setIdProduto(getId(route.params));
      setNomeProduto(getNome(route.params) ?? '');
      setValorProduto(String(getValor(route.params) ?? ''));
      setCategoriaId(getProdutoCategoriaId(route.params) ?? null);
    }
  }, [route.params]);

  useEffect(() => {
    if (categoriaId || !route.params || categorias.length === 0) return;
    const nomeCategoria = getProdutoCategoriaNome(route.params);
    const categoria = categorias.find((cat) => getCategoriaNome(cat) === nomeCategoria);
    if (categoria) setCategoriaId(getCategoriaId(categoria));
  }, [categoriaId, categorias, route.params]);

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

    if (!idProduto || idProduto <= 0) {
      Alert.alert('Atencao', 'Verifique o ID do produto.');
      return;
    }

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
      await endpoints.produtos.editar(idProduto, { nome, valor, idCategoria: categoriaId });
      Alert.alert('Sucesso', 'Produto alterado.');
      navigation.goBack();
    } catch (error) {
      logApiError('Alterar produto', error);
      Alert.alert('Erro', 'Nao foi possivel alterar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Produto</Text>
      <StatusBar style="auto" />

      <TextInput
        value={idProduto ? String(idProduto) : ''}
        editable={false}
        style={[styles.input, styles.disabledInput]}
      />

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
  disabledInput: { backgroundColor: '#F1F5F9', color: '#64748B' },
  button: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8, width: '95%', height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  cancelButton: { backgroundColor: '#eee' },
  saveButton: { backgroundColor: '#4CAF50' },
  disabledButton: { opacity: 0.7 },
  pickerContainer: { width: '95%', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginBottom: 16 },
  picker: { height: 50 },
  textButton: { fontSize: 16 },
});