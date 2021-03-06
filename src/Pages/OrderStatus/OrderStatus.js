import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import firebase from '../../Firebase.js';
import '../Hall/Hall.css';
import Button from '../../Components/Button.js';
import Header from '../../Components/Header.js';


const OrderStatus = () => {
  const [order, setOrder] = useState([]);
  const [pending, setPending] = useState(true);
  const [preparing, setPreparing] = useState(false);
  const [ready, setReady] = useState(false);
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection('orders')
      .onSnapshot((itens) => {
        const arrayItens = [];
        itens.forEach((item) => {
          const dataItem = item.data();
          dataItem.uid = item.id;
          arrayItens.push(dataItem);
        });
        setOrder(arrayItens);
      });
  }, []);

  const openPending = () => {
    setPending(true);
    setPreparing(false);
    setReady(false);
    setDelivered(false);
  };

  const openPreparing = () => {
    setPending(false);
    setPreparing(true);
    setReady(false);
    setDelivered(false);
  };

  const openReady = () => {
    setPending(false);
    setPreparing(false);
    setReady(true);
    setDelivered(false);
  };

  const openDelivered = () => {
    setPending(false);
    setPreparing(false);
    setReady(false);
    setDelivered(true);
  };

  const changeDeliveredStatus = (newStatus, index) => {
    firebase
      .firestore()
      .collection('orders')
      .doc(order[index].uid)
      .update({
        status: newStatus,
        finalTime: new Date().toLocaleString('pt-BR'),
      })
      .then(() => {});
  };
  const deleteOrder = (index) => {
    firebase.firestore().collection('orders').doc(order[index].uid).delete();
  };

  return (
    <div className="kitchen">
      <div className="header-container">
        <Header />
      </div>
      <div className="page-order">
        <div className="btn">
          <Button
            className="button-cafe"
            color="primary"
            name="Pendente"
            onClick={openPending}
          />
          <Button
            className="button-cafe"
            color="primary"
            name="Preparando"
            onClick={openPreparing}
          />
          <Button
            className="button-cafe"
            color="primary"
            name="Pronto"
            onClick={openReady}
          />
          <Button
            className="button-cafe"
            color="primary"
            name="Histórico de Pedidos"
            onClick={openDelivered}
          />
        </div>
        {pending &&
          order
            .filter((item) => item.status === 'Pendente')
            .map((item, index) => (
              <div className="card-lista">
                <div className="card-titulo">
                  <p>Atendente:{item.waiterName}</p>
                  <p>Mesa: {item.table}</p>
                  <p>Cliente: {item.clientName}</p>
                  <p>Atendimento: {item.initialTime}</p>
                  <p>Status: {item.status}</p>
                </div>
                <div>
                  {item.orders.map((product) => (
                    <div className="card-pedido">
                      <img src={product.img} alt="img" />
                      <p>
                        <span>{product.count} x </span>{' '}
                        <span>{product.item}</span>
                      </p>
                      <p>R$ {product.value},00</p>
                    </div>
                  ))}
                  <div>
                    <h3>Total: R$ {item.total},00</h3>
                  </div>
                </div>
                <div className="bt-container">
                  <Button
                    color="secondary"
                    name="Cancelar Pedido"
                    onClick={() => deleteOrder(index)}
                  />
                </div>
              </div>
            ))}
        {preparing &&
          order
            .filter((item) => item.status === 'Preparando')
            .map((item) => (
              <div className="card-lista">
                <div className="card-titulo">
                  <p>Atendente:{item.waiterName}</p>
                  <p>Mesa: {item.table}</p>
                  <p>Cliente: {item.clientName}</p>
                  <p>Cozinheiro:{item.cookName}</p>
                  <p>Atendimento: {item.initialTime}</p>
                  <p>Início Preparo: {item.preparingTime}</p>
                  <p>Status: {item.status}</p>
                </div>
                <div>
                  {item.orders.map((product) => (
                    <div className="card-pedido">
                      <img src={product.img} alt="img" />
                      <p>
                        <span>{product.count} x </span> {product.item}
                      </p>
                      <p>R$ {product.value},00</p>
                    </div>
                  ))}
                  <div>
                    <h3>Total: R$ {item.total},00</h3>
                  </div>
                </div>
                <div className="bt-container"></div>
              </div>
            ))}
        {ready &&
          order
            .filter((item) => item.status === 'Pronto')
            .map((item, index) => (
              <div className="card-lista">
                <div className="card-titulo">
                  <p>Atendente:{item.waiterName}</p>
                  <p>Mesa: {item.table}</p>
                  <p>Cliente: {item.clientName}</p>
                  <p>Cozinheiro:{item.cookName}</p>
                  <p>Atendimento: {item.initialTime}</p>
                  <p>Início Preparo: {item.preparingTime}</p>
                  <p>Término Preparo: {item.readyTime}</p>
                  <p>Status: {item.status}</p>
                </div>
                <div>
                  {item.orders.map((product) => (
                    <div className="card-pedido">
                      <img src={product.img} alt="img" />
                      <p>
                        <span>{product.count} x </span> {product.item}
                      </p>
                      <p>R$ {product.value},00</p>
                    </div>
                  ))}
                  <div>
                    <h3>Total: R$ {item.total},00</h3>
                  </div>
                </div>
                <div className="bt-container">
                  <Button
                    color="primary"
                    name="Entregar"
                    onClick={() => changeDeliveredStatus('Entregue', index)}
                  />
                </div>
              </div>
            ))}
        {delivered &&
          order
            .filter((item) => item.status === 'Entregue')
            .map((item, index) => (
              <div className="card-lista">
                <div className="card-titulo">
                  <p>Atendente:{item.waiterName}</p>
                  <p>Mesa: {item.table}</p>
                  <p>Cliente: {item.clientName}</p>
                  <p>Cozinheiro:{item.cookName}</p>
                  <p>Atendimento: {item.initialTime}</p>
                  <p>Início Preparo: {item.preparingTime}</p>
                  <p>Término Preparo: {item.readyTime}</p>
                  <p>Pedido entregue: {item.finalTime}</p>
                  <p>Status: {item.status}</p>
                </div>
                <div>
                  {item.orders.map((product) => (
                    <div className="card-pedido">
                      <img src={product.img} alt="img" />
                      <p>
                        <span>{product.count} x </span> {product.item}
                      </p>
                      <span>R$ {product.value},00</span>
                    </div>
                  ))}
                  <div>
                    <h3>Total: R$ {item.total},00</h3>
                  </div>
                </div>
                </div>
            ))}
      </div>
    </div>
    
  );
};
export default OrderStatus;