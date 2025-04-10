import React from "react";
import type { StatisticProps } from "antd";
import { Col, Row, Statistic } from "antd";
import CountUp from "react-countup";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const Stats: React.FC = () => (
  <Row gutter={16} style={{ marginBottom: 25 }}>
    <Col span={6}>
      <Statistic
        title="Usuarios"
        value={112893}
        formatter={formatter}
        precision={2}
      />
    </Col>
    <Col span={6}>
      <Statistic
        title="Compras"
        value={112893}
        precision={2}
        formatter={formatter}
      />
    </Col>
    <Col span={6}>
      <Statistic
        title="Marcas"
        value={112893}
        precision={2}
        formatter={formatter}
      />
    </Col>
    <Col span={6}>
      <Statistic
        title="Categorias"
        value={112893}
        precision={2}
        formatter={formatter}
      />
    </Col>
  </Row>
);

export default Stats;
