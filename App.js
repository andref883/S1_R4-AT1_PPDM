import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/Home';
import CategoriaScreen from './src/screens/Categoria';
import CategoriaScreenIncluir from './src/screens/Categoria/incluirCategoria';
import CategoriaScreenEditar from './src/screens/Categoria/editarCategoria';
import ProdutoScreen from './src/screens/Produto';
import ProdutoScreenIncluir from './src/screens/Produto/incluirProduto';
import ProdutoScreenEditar from './src/screens/Produto/editarProduto';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoriaScreen"
          component={CategoriaScreen}
          options={{ title: 'Manutencao de categorias' }}
        />
        <Stack.Screen
          name="CategoriaScreenIncluir"
          component={CategoriaScreenIncluir}
          options={{ title: 'Inclusao de categorias' }}
        />
        <Stack.Screen
          name="CategoriaScreenEditar"
          component={CategoriaScreenEditar}
          options={{ title: 'Edicao de categorias' }}
        />
        <Stack.Screen
          name="ProdutoScreen"
          component={ProdutoScreen}
          options={{ title: 'Manutencao de produtos' }}
        />
        <Stack.Screen
          name="ProdutoScreenIncluir"
          component={ProdutoScreenIncluir}
          options={{ title: 'Inclusao de produtos' }}
        />
        <Stack.Screen
          name="ProdutoScreenEditar"
          component={ProdutoScreenEditar}
          options={{ title: 'Edicao de produtos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
