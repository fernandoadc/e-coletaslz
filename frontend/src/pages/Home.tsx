import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import "../styles/Home.css";
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">
                Revolucionando a Gestão de Resíduos
              </h1>
              <p className="hero-subtitle">
                Conectamos estabelecimentos comerciais a coletores de resíduos
                de forma eficiente, sustentável e tecnológica.
              </p>
              <div className="cta-buttons">
                <Button
                  onClick={() => navigate('/coletor/auth')}
                  variant="primary"
                  size="lg"
                  className="me-3"
                  aria-label="Cadastre-se como Coletor"
                >
                  Sou Coletor
                </Button>
                <Button
                  href="/cadastro/estabelecimento"
                  variant="outline-primary"
                  size="lg"
                  aria-label="Cadastre-se como Estabelecimento"
                >
                  Sou Estabelecimento
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-image">
              <img
                src="/images/waste-management.svg"
                alt="Ilustração de gestão de resíduos"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">
            Como Funciona Nosso Serviço
          </h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <Card.Title>Agendamento Inteligente</Card.Title>
                  <Card.Text>
                    Programe coletas de acordo com sua necessidade e receba
                    notificações antes da visita.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <Card.Title>Rastreamento em Tempo Real</Card.Title>
                  <Card.Text>
                    Acompanhe a rota dos coletores e saiba exatamente quando
                    chegarão ao seu local.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-recycle"></i>
                  </div>
                  <Card.Title>Relatórios de Sustentabilidade</Card.Title>
                  <Card.Text>
                    Tenha acesso a dados detalhados sobre o volume e destino dos
                    seus resíduos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">
            O Que Nossos Clientes Dizem
          </h2>
          <Row>
            <Col lg={4} className="mb-4">
              <Card className="testimonial-card h-100">
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>
                      "Reduzimos nossos custos com coleta em 30% após adotar a
                      plataforma. A eficiência aumentou significamente."
                    </p>
                    <footer className="blockquote-footer">
                      <cite title="Source Title">Supermercado Verde</cite>
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="testimonial-card h-100">
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>
                      "Como coletor autônomo, consegui aumentar minha renda em
                      40% com os agendamentos pela plataforma."
                    </p>
                    <footer className="blockquote-footer">
                      <cite title="Source Title">Carlos, Coletor Parceiro</cite>
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="testimonial-card h-100">
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>
                      "A transparência no processo de coleta e destinação final
                      nos ajudou a melhorar nossa certificação ambiental."
                    </p>
                    <footer className="blockquote-footer">
                      <cite title="Source Title">Shopping EcoCenter</cite>
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta py-5">
        <Container className="text-center">
          <h2 className="mb-4">Pronto para Transformar sua Gestão de Resíduos?</h2>
          <p className="lead mb-5">
            Cadastre-se agora e experimente a plataforma que está modernizando a
            coleta de lixo em todo o país.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              href="/cadastro/coletor"
              variant="primary"
              size="lg"
              aria-label="Cadastre-se como Coletor"
            >
              Cadastro para Coletores
            </Button>
            <Button
              href="/cadastro/estabelecimento"
              variant="success"
              size="lg"
              aria-label="Cadastre-se como Estabelecimento"
            >
              Cadastro para Estabelecimentos
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
