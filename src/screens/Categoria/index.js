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
  return item?.Id ?? item?.id ?? item?.CategoriaId ?? item?.categoriaId;
}

function getNome(item) {
  return item?.Nome ?? item?.nome ?? item?.NomeCategoria ?? item?.nomeCategoria;
}

export default function CategoriaScreen() {
  const navigation = useNavigation();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      setLoading(true);
      const response = await api.get('/categorias');
      setCategorias(getList(response.data));
    } catch (error) {
      logApiError('Listar categorias', error);
      Alert.alert('Erro', 'Nao foi possivel listar as categorias.');
    } finally {
      setLoading(false);
    }
  }

  async function deletarCategoria(id) {
    if (!id || id <= 0) {
      Alert.alert('Atencao', 'ID da categoria invalido.');
      return;
    }

    Alert.alert('Confirmacao', 'Deseja realmente excluir esta categoria?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/categorias/${id}`);
            await loadData();
            Alert.alert('Sucesso', 'Categoria excluida.');
          } catch (error) {
            logApiError('Excluir categoria', error);
            Alert.alert(
              'Erro',
              'Nao foi possivel excluir. Verifique se existem produtos vinculados.'
            );
          }
        },
      },
    ]);
  }

  function editarCategoria(item) {
    navigation.navigate('CategoriaScreenEditar', {
      ...item,
      Id: getId(item),
      Nome: getNome(item),
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestao de categorias</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CategoriaScreenIncluir')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categorias}
        keyExtractor={(item, index) => String(getId(item) ?? index)}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Carregando...' : 'Nenhuma categoria cadastrada.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.sideBar} />

            <View style={styles.conteudo}>
              <View style={styles.cardInner}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>ID: {getId(item)}</Text>
                  <Text style={styles.title}>Categoria: {getNome(item)}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#E3F2FD' }]}
                  onPress={() => editarCategoria(item)}
                >
                  <Text style={styles.iconText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#FFEBEE' }]}
                  onPress={() => deletarCategoria(getId(item))}
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
  conteudo: {
    flex: 1,
    padding: 5,
    flexDirection: 'column',
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
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
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
