import { useState } from 'react';
import { Row, Col, Button, Space, Select } from 'antd';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './PDFCss.css';
import Left_Arrow from '../../images/main/left_arrow.png';
import Left_Arrow_Off from '../../images/main/left_arrow_off.png';
import Right_Arrow from '../../images/main/right_arrow.png';
import Right_Arrow_Off from '../../images/main/right_arrow_off.png';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = new URL('npm:pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

export default function Sample() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoaded = ({ numPages }) => setNumPages(numPages);

    return (
        <div>
            <Row gutter={[48, 24]}>
                <Col span={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        type="text"
                        style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '21px', fontWeight: '700' }}
                        onClick={() => setPageNumber(pageNumber === 1 ? pageNumber : pageNumber - 1)}
                    >
                        <img src={pageNumber === 1 ? Left_Arrow_Off : Left_Arrow} alt="Prev" title="Prev" style={{ width: '70px' }} />
                        Prev
                    </Button>
                </Col>
                <Col span={20}>
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Document file="xbtmanual.pdf" onLoadSuccess={onDocumentLoaded}>
                                <Page pageNumber={pageNumber} scale={1.5} />
                            </Document>
                        </Col>
                        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Space wrap>
                                Page {pageNumber} of {numPages}
                                <Select
                                    defaultValue=""
                                    style={{
                                        width: 120
                                    }}
                                    onChange={(e) => setPageNumber(e)}
                                    options={[
                                        {
                                            value: 1,
                                            label: 1
                                        },
                                        {
                                            value: 5,
                                            label: 5
                                        },
                                        {
                                            value: 10,
                                            label: 10
                                        },
                                        {
                                            value: 15,
                                            label: 15
                                        },
                                        {
                                            value: 20,
                                            label: 20
                                        },
                                        {
                                            value: 25,
                                            label: 25
                                        },
                                        {
                                            value: 30,
                                            label: 30
                                        },
                                        {
                                            value: 35,
                                            label: 35
                                        },
                                        {
                                            value: 40,
                                            label: 40
                                        },
                                        {
                                            value: numPages,
                                            label: numPages
                                        }
                                    ]}
                                />
                            </Space>
                        </Col>
                    </Row>
                </Col>
                <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        type="text"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            fontSize: '21px',
                            fontWeight: '700'
                        }}
                        onClick={() => setPageNumber(numPages === pageNumber ? numPages : pageNumber + 1)}
                    >
                        Next
                        <img
                            src={numPages === pageNumber ? Right_Arrow_Off : Right_Arrow}
                            alt="Next"
                            title="Next"
                            style={{ width: '70px' }}
                        />
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
