import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { FaGoogle, FaUser, FaLock, FaEnvelope, FaPhone, FaTruck } from 'react-icons/fa';
import '../styles/CollectorAuth.css';

const CollectorAuth: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicleType: 'pickup'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    if (!isLoginView && !formData.name) {
      setError('Nome completo é obrigatório');
      return;
    }

    // Simulação de chamada à API
    setTimeout(() => {
      setSuccess(isLoginView ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!');
      // Aqui você faria a navegação para a dashboard após autenticação
    }, 1000);
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log(credentialResponse);
    // Aqui você enviaria o credentialResponse.credential para seu backend
    // para validar e autenticar o usuário
    setSuccess('Autenticação com Google realizada com sucesso!');
  };

  const handleGoogleError = () => {
    setError('Falha ao autenticar com Google');
  };

  return (
    <GoogleOAuthProvider clientId="SEU_CLIENT_ID_GOOGLE_AQUI">
      <Container className="collector-auth-container py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="auth-card shadow">
              <Card.Body>
                <div className="text-center mb-4">
                  <FaTruck className="collector-icon" />
                  <h2>{isLoginView ? 'Login do Coletor' : 'Cadastro de Coletor'}</h2>
                  <p className="text-muted">
                    {isLoginView
                      ? 'Acesse sua conta para gerenciar suas coletas'
                      : 'Cadastre-se para começar a receber solicitações de coleta'}
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {!isLoginView && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Nome Completo</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaUser />
                          </span>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Seu nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaPhone />
                          </span>
                          <Form.Control
                            type="tel"
                            name="phone"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Tipo de Veículo</Form.Label>
                        <Form.Select
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleChange}
                          required
                        >
                          <option value="pickup">Caminhonete</option>
                          <option value="truck">Caminhão</option>
                          <option value="van">Van</option>
                          <option value="other">Outro</option>
                        </Form.Select>
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Senha</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder={isLoginView ? 'Sua senha' : 'Crie uma senha forte'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </div>
                    {!isLoginView && (
                      <Form.Text className="text-muted">
                        Mínimo de 6 caracteres
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3 auth-button"
                  >
                    {isLoginView ? 'Entrar' : 'Cadastrar'}
                  </Button>

                  <div className="divider my-4">
                    <span>OU</span>
                  </div>

                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    text={isLoginView ? 'signin_with' : 'signup_with'}
                    shape="rectangular"
                    size="large"
                    locale="pt_BR"
                    width="100%"
                  />

                  <div className="text-center mt-4">
                    <Button
                      variant="link"
                      onClick={() => setIsLoginView(!isLoginView)}
                    >
                      {isLoginView
                        ? 'Não tem uma conta? Cadastre-se'
                        : 'Já tem uma conta? Faça login'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {isLoginView && (
              <div className="text-center mt-3">
                <Button variant="link" size="sm">
                  Esqueceu sua senha?
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default CollectorAuth;
