import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { CartItemProps } from '../@types/cartItem';
import { Product } from '../@types/product';

import { Button } from '../components/Button';
import { Cart } from '../components/Cart';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Empty } from '../components/Icons/Empty';
import { Menu } from '../components/Menu/';
import { TableModal } from '../components/TableModal';
import { Text } from '../components/Text';

import { products as mockProducts } from '../mocks/products';

import * as S from './styles';

export function Main() {
  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cartItem, setCartItem] = useState<CartItemProps[]>([]);

  const [products] = useState<Product[]>([]);

  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }


  function handleResetOrder() {
    setSelectedTable('');
    setCartItem([]);
  }

  //Adicionar item no carrinho
  function handleAddToCart(product: Product) {
    if (!selectedTable) {
      setTableModalVisible(true);
    }

    //setCartItem
    setCartItem((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };

      return newCartItems;
    });
  }

  //Decrementar o item do carrinho
  function handleDecrementCartItem(product: Product) {
    //setCartItem
    setCartItem((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      const newCartItems = [...prevState];
      const item = prevState[itemIndex];

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);
        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems;
    });
  }


  return (
    <>
      <S.Container>
        <Header selectedTable={selectedTable} onCancelOrder={handleResetOrder} />

        {!isLoading && (
          <>
            <S.CategoriesContainer>
              <Categories />
            </S.CategoriesContainer>

            {products.length > 0 ? (
              <S.MenuContainer>
                <Menu onAddToCart={handleAddToCart} products={products} />
              </S.MenuContainer>
            ) : (
              <S.CenteredContainer>
                <Empty />
                <Text color="#666" style={{ marginTop: 24 }}>Nenhum produto foi encontrado!</Text>
              </S.CenteredContainer>
            )}
          </>
        )}

        {isLoading && (
          <S.CenteredContainer>
            <ActivityIndicator color="#D73035" size="large" />
          </S.CenteredContainer>
        )}
      </S.Container>

      <S.Footer>
        <S.FooterContainer>
          {!selectedTable && (
            <Button onPress={() => setTableModalVisible(true)} disabled={isLoading}>
              Novo Pedido
            </Button>
          )}

          {selectedTable && (
            <Cart
              cartItems={cartItem}
              onAdd={handleAddToCart}
              onDecrement={handleDecrementCartItem}
              onConfirmOrder={handleResetOrder}
            />
          )}
        </S.FooterContainer>
      </S.Footer>

      <TableModal
        visible={tableModalVisible}
        onClose={() => setTableModalVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  );
}
