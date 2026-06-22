import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import api, { logApiError } from '../../api/api';

function getList(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.Result)) return responseData.Result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function getId(item) {
  return item?.Id ?? item?.id ?? item?.ProdutoId ?? item?.produtoId;
}

function getNome(item) {
  return item?.NomeProduto ?? item?.nomeProduto ?? item?.Nome ?? item?.nome;
}

function getValor(item) {
  return item?.Valor ?? item?.valor ?? item?.Preco ?? item?.preco;
}

function getCategoriaNome(item) {
  return item?.NomeCategoria ?? item?.nomeCategoria ?? item?.Categoria?.Nome;
}

export default function ProdutoScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProdutos(getList(response.data));
    } catch (error) {
      logApiError('Listar produtos', error);
      Alert.alert('Erro', 'Nao foi possivel listar os produtos.');
    } finally {
      setLoading(false);
    }
  }

  async function deletarProduto(id) {
    if (!id || id <= 0) {
      Alert.alert('Atencao', 'ID do produto invalido.');
      return;
    }

    Alert.alert('Confirmacao', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/produtos/${id}`);
            await loadData();
            Alert.alert('Sucesso', 'Produto excluido.');
          } catch (error) {
            logApiError('Excluir produto', error);
            Alert.alert('Erro', 'Nao foi possivel excluir o produto.');
          }
        },
      },
    ]);
  }

  function editarProduto(item) {
    navigation.navigate('ProdutoScreenEditar', {
      ...item,
      Id: getId(item),
      NomeProduto: getNome(item),
      Valor: getValor(item),
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestao de produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProdutoScreenIncluir')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item, index) => String(getId(item) ?? index)}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Carregando...' : 'Nenhum produto cadastrado.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.sideBar} />

            <View style={styles.cardInner}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>ID: {getId(item)}</Text>
                <Text style={styles.title}>Produto: {getNome(item)}</Text>
                <Text style={styles.title}>Valor R$: {getValor(item)}</Text>
                <Text style={styles.title}>
                  Categoria: {getCategoriaNome(item) ?? 'Nao informada'}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#E3F2FD' }]}
                  onPress={() => editarProduto(item)}
                >
                  <Text style={styles.iconText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#FFEBEE' }]}
                  onPress={() => deletarProduto(getId(item))}
                >
                  <Text style={styles.iconText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sideBar: {
    width: 6,
    backgroundColor: '#FF9800',
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleScreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginTop: 12,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 5,
  },
  iconText: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#64748B',
  },
});
