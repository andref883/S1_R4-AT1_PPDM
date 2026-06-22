import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import api, { logApiError } from '../../api/api';

function getId(item) {
  return item?.Id ?? item?.id ?? item?.CategoriaId ?? item?.categoriaId;
}

function getNome(item) {
  return item?.Nome ?? item?.nome ?? item?.NomeCategoria ?? item?.nomeCategoria;
}

export default function CategoriaScreenEditar() {
  const route = useRoute();
  const navigation = useNavigation();
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (route.params) {
      setIdCategoria(getId(route.params));
      setNomeCategoria(getNome(route.params) ?? '');
    }
  }, [route.params]);

  async function salvar() {
    const nome = nomeCategoria.trim();

    if (nome.length < 3) {
      Alert.alert('Atencao', 'Informe corretamente o nome da categoria.');
      return;
    }

    if (!idCategoria || idCategoria <= 0) {
      Alert.alert('Atencao', 'Verifique o ID da categoria.');
      return;
    }

    try {
      setSalvando(true);
      await api.put(`/categorias/${idCategoria}`, {
        nome,
      });
      Alert.alert('Sucesso', 'Categoria alterada.');
      navigation.goBack();
    } catch (error) {
      logApiError('Alterar categoria', error);
      Alert.alert('Erro', 'Nao foi possivel alterar a categoria.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Categoria</Text>
      <StatusBar style="auto" />

      <TextInput
        value={idCategoria ? String(idCategoria) : ''}
        editable={false}
        style={[styles.input, styles.disabledInput]}
      />

      <TextInput
        placeholder="Digite o nome da categoria"
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={salvando}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton, salvando && styles.disabledButton]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={{ color: '#fff' }}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%',
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
