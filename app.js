/* ════════════════════════════════════════════════════════════════════
   FEP COMPASS v2.0 — application logic
   Knowledge base · BM25 RAG · OCR / PDF readers · AI compliance analyst
   ════════════════════════════════════════════════════════════════════ */
'use strict';

/* ━━━ KNOWLEDGE BASE — BNM FEP NOTICES 1–7 (effective 1 Oct 2025) ━━━ */

const BNM_NOTICES_URL = 'https://www.bnm.gov.my/fep/policies/notices';

const NOTICES = {
  1: { id:1, short:'N1', icon:'ti-coin', title:'Dealings in Currency, Gold and Other Precious Metals',
    desc:'Who may buy or sell foreign currency, on spot or forward basis, hedging frameworks and dealings with money changers.',
    secs: [
      {ref:'Part A, Para 1(1)',title:'Resident — buying/selling FCY vs Ringgit',body:'A Resident is allowed to buy or sell Foreign Currency against Ringgit for its own account on Spot Basis with a LOB, or on Forward Basis with a LOB on Firm Commitment or Anticipatory basis. The Forward Basis transaction shall be terminated when the Firm Commitment ceases to exist or the anticipated transaction does not materialise.'},
      {ref:'Part A, Para 5',title:'Resident — buying/selling FCY vs another FCY',body:'A Resident is allowed to buy or sell Foreign Currency against another Foreign Currency on Spot Basis or Forward Basis with a LOB.'},
      {ref:'Part A, Para 3',title:'Resident Entity — transacting on behalf of Group entities',body:'A Resident Entity is allowed to buy or sell Foreign Currency against Ringgit on behalf of an Entity within its Group with a LOB, provided the Principal is not a Financial Institution or NRFI, and the Principal complies with applicable paragraphs based on Resident or Non-Resident status.'},
      {ref:'Part A, Para 2',title:'Resident Institutional Investor — Dynamic Hedging Framework',body:'A Resident Institutional Investor registered with BNM under the Dynamic Hedging Framework is allowed to enter into plain vanilla forward contracts to sell FCY against Ringgit up to 100% of its FCY-denominated securities and temporary FCY deposits, without documentary evidence. One-off registration required via BNM website https://bnm.my/fep.'},
      {ref:'Part B, Para 6(1)',title:'Non-Resident — buying/selling FCY vs Ringgit',body:'A Non-Resident is allowed to buy or sell Foreign Currency against Ringgit on Spot Basis with a LOB or AOO; or on Forward Basis with a LOB or AOO for Current Account Transactions (Firm Commitment or Anticipatory basis) or Financial Account Transactions (Firm Commitment basis only). Forward terminates when Firm Commitment ceases or anticipated transaction does not materialise.'},
      {ref:'Part B, Para 12',title:'Non-Resident — Forward Basis restrictions and exclusions',body:'For Non-Residents, Forward Basis EXCLUDES: (i) settlement of Ringgit negotiable instrument of deposits; (ii) transactions involving an External Account (except Ringgit deposits up to 3 months from Ringgit Asset sale prior to forward maturity); or (iii) settlement of OTC derivatives tantamount to Ringgit borrowing/lending between Resident and Non-Resident.'},
      {ref:'Part B, Para 13',title:'Non-Resident — buying/selling FCY vs another FCY',body:'A Non-Resident is allowed to buy or sell Foreign Currency against another Foreign Currency on Spot Basis or Forward Basis with a LOB.'},
      {ref:'Part B, Para 7',title:'Non-Resident Institutional Investor — Dynamic Hedging',body:'A Non-Resident Institutional Investor registered with BNM may buy FCY against Ringgit up to 100% or sell FCY against Ringgit up to 25% of its Ringgit-denominated asset exposure (Ringgit securities on RENTAS/Bursa Malaysia). Registration required via https://bnm.my/fep.'},
      {ref:'Part C, Para 14',title:'Licensed Money Changer — dealings',body:'A Resident or Non-Resident is allowed to buy or sell Foreign Currency against Ringgit or against another Foreign Currency on Spot Basis with a Licensed Money Changer.'},
      {ref:'Part D, Para 16',title:'Gold and Precious Metals',body:'A person is allowed to buy, sell, exchange, borrow, lend, retain or use gold or other precious metals (subject to FSA/IFSA). Export of gold or other precious metals is subject to compliance with Notice 7.'},
    ],
    kw:['buy','sell','dealing','forward','spot','hedging','LOB','AOO','money changer','institutional investor','FCY','ringgit','gold','precious metals','anticipatory','firm commitment','unwind','cancel','speculate','dynamic hedging','hedge','forward contract','currency exchange'] },
  2: { id:2, short:'N2', icon:'ti-building-bank', title:'Borrowing, Lending and Guarantee',
    desc:'Ringgit and foreign-currency borrowing limits for individuals and entities, lending permissions and financial guarantees.',
    secs: [
      {ref:'Part A, Para 1',title:'Resident Individual — Ringgit borrowing from Non-Resident (unlimited for immediate family/employer)',body:'A Resident Individual is allowed to borrow in Ringgit in any amount from: (a) Non-Resident Immediate Family Member; or (b) employer in Malaysia for use in Malaysia subject to employment contract terms.'},
      {ref:'Part A, Para 2',title:'Resident Individual/Sole Prop/GP — Ringgit borrowing (RM1M limit)',body:'A Resident Individual, sole proprietor or General Partnership is allowed to borrow in Ringgit up to RM1 million in aggregate for use in Malaysia from a Non-Resident excluding a NRFI.'},
      {ref:'Part A, Para 3',title:'Resident Individual — FCY borrowing from immediate family (unlimited)',body:'A Resident Individual is allowed to borrow in Foreign Currency in any amount from his Immediate Family Member.'},
      {ref:'Part A, Para 4',title:'Resident Individual/Sole Prop/GP — FCY borrowing (RM10M limit)',body:'A Resident Individual, sole proprietor or General Partnership is allowed to borrow in Foreign Currency up to RM10 million equivalent in aggregate from a LOB or a Non-Resident.'},
      {ref:'Part B, Para 6',title:'Resident Entity — Ringgit borrowing from NR within Group (unlimited) for Real Sector Activity',body:'A Resident Entity is allowed to borrow in Ringgit in any amount to finance Real Sector Activity in Malaysia from a Non-Resident within the Resident Entity\'s Group (including Non-Resident Direct Shareholder), EXCLUDING a NRFI or Non-Resident SPV used to obtain borrowing from outside the Group.'},
      {ref:'Part B, Para 8',title:'Resident Entity — Ringgit borrowing (RM1M from external NR; unlimited from MDB/QDFI)',body:'A Resident Entity is allowed to borrow in Ringgit for use in Malaysia: (a) up to RM1 million in aggregate from a Non-Resident excluding a NRFI; and (b) in any amount from a Multilateral Development Bank or Qualified Development Financial Institution.'},
      {ref:'Part B, Para 9',title:'Resident Entity — FCY borrowing unlimited from LOB, Group, or Direct Shareholder',body:'A Resident Entity is allowed to borrow in Foreign Currency in any amount from: (a) a LOB; or (b) an Entity within the Resident Entity\'s Group or the Resident Entity\'s Direct Shareholder.'},
      {ref:'Part B, Para 10',title:'Resident Entity — FCY borrowing (RM100M limit from external NR/NRFI)',body:'A Resident Entity is allowed to borrow in Foreign Currency up to RM100 million equivalent in aggregate from: (a) a Non-Resident outside the Resident Entity\'s Group; (b) a NRFI; or (c) a Non-Resident SPV used to obtain borrowing from outside the Group. The RM100M limit is computed on a parent-subsidiary group basis.'},
      {ref:'Part D, Para 13',title:'Non-Resident Individual — Ringgit borrowing',body:'A Non-Resident Individual is allowed to borrow in Ringgit in any amount from: (a) Immediate Family Member; (b) licensed insurer or takaful operator up to cash surrender value of life policy; or (c) employer in Malaysia for use in Malaysia.'},
      {ref:'Part D, Para 14',title:'Non-Resident (excl NRFI) — Ringgit borrowing from Resident for Real Sector Activity',body:'A Non-Resident (excluding a NRFI) is allowed to borrow in Ringgit in any amount from: (a) a Resident to finance Real Sector Activity in Malaysia; or (b) a Resident stockbroker for margin financing on Bursa Malaysia.'},
      {ref:'Part D, Para 16',title:'Non-Resident — Ringgit borrowing from LOB',body:'A Non-Resident is allowed to borrow in Ringgit from a LOB: (a) in any amount for trade financing for settlement of trade in goods/services with a Resident; (b) up to overdraft amount (max 2 business days, no roll-over) to avoid Bursa/RENTAS settlement failure; or (c) up to RM10 million via repurchase or sale buy-back agreement.'},
      {ref:'Part D, Para 17',title:'Non-Resident — FCY borrowing',body:'A Non-Resident is allowed to borrow in Foreign Currency: (a) in any amount from a LOB, Resident Immediate Family Member, or Non-Resident in Malaysia; or (b) up to the limit in Parts A and B of Notice 3 from another Resident.'},
      {ref:'Part F, Para 19',title:'Lending — general permission',body:'A person is allowed to lend in Ringgit or Foreign Currency to a Resident or Non-Resident for any corresponding Borrowing approved in this Notice or otherwise approved in writing by BNM.'},
      {ref:'Part G, Para 20',title:'LOB — Financial Guarantee (any amount)',body:'A LOB is allowed to: (a) obtain a Financial Guarantee in any amount in Ringgit or FCY for its own account; and (b) give a Financial Guarantee in any amount in Ringgit or FCY on behalf of its banking group or client.'},
      {ref:'Part G, Para 21',title:'Resident guarantor — securing Resident borrowing (any amount)',body:'A Resident guarantor is allowed to give a Financial Guarantee in any amount in Ringgit or FCY to secure any Borrowing obtained by a Resident in Ringgit or FCY as approved in this Notice.'},
      {ref:'Part G, Para 22',title:'Non-bank Resident guarantor — securing Non-Resident borrowing (conditions apply)',body:'A non-bank Resident guarantor may give a Financial Guarantee in any amount to secure a Non-Resident\'s Borrowing, EXCEPT: (a) if the underlying Borrowing is ultimately utilised by the Resident guarantor — deemed as Borrowing by the Resident guarantor, subject to Notice 2 limits; or (b) if Resident has arranged to repay the FCY Borrowing other than under a call-upon in event of default — deemed as investment in FCY Asset, subject to Notice 3 limits.'},
      {ref:'Part G, Para 23',title:'Resident lender — obtaining guarantee from Non-Resident',body:'A Resident lender is allowed to obtain a Financial Guarantee in any amount in FCY or Ringgit from a Non-Resident guarantor to secure a Borrowing obtained by a Resident or Non-Resident borrower.'},
      {ref:'Part G, Para 25',title:'Non-Financial Guarantee — any amount',body:'A Resident is allowed to give or obtain a Non-Financial Guarantee (e.g. performance bond, tender bond, guarantee for supply of goods/services, shipping guarantee) in any amount in FCY or Ringgit to/from a Non-Resident.'},
    ],
    kw:['borrow','borrowing','lend','lending','loan','guarantee','financial guarantee','non-financial guarantee','performance bond','RM10 million','RM100 million','RM1 million','NRFI','SPV','group','direct shareholder','trade financing','real sector','refinance','immediate family','LOB','credit facility'] },
  3: { id:3, short:'N3', icon:'ti-chart-line', title:'Investment in Foreign Currency Asset',
    desc:'How much Residents may invest abroad — the RM1 million / RM50 million equivalent annual conversion limits and when they apply.',
    secs: [
      {ref:'Part A, Para 1',title:'Resident Individual (no Domestic Ringgit Borrowing) — investment limit UNLIMITED',body:'A Resident Individual, sole proprietorship or General Partnership WITHOUT Domestic Ringgit Borrowing (DRB) is allowed to invest in Foreign Currency Asset up to ANY amount, both onshore and offshore.'},
      {ref:'Part A, Para 2',title:'Resident Individual (WITH Domestic Ringgit Borrowing) — investment limits',body:'A Resident Individual WITH Domestic Ringgit Borrowing may invest in FCY Asset up to: (a) any amount using FCY funds from outside Malaysia (except Export of Goods proceeds) or approved FCY Borrowing under Notice 2; (b) any amount in real estate outside Malaysia for education, employment or migration (own/immediate family accommodation only); or (c) RM1 million equivalent per calendar year from conversion of Ringgit, Trade FCA, or swapping of Ringgit-denominated financial asset. Computed in aggregate including sole proprietorship and General Partnership owned by same individual.'},
      {ref:'Part B, Para 3',title:'Resident Entity (no Domestic Ringgit Borrowing) — investment limit UNLIMITED',body:'A Resident Entity WITHOUT Domestic Ringgit Borrowing is allowed to invest in Foreign Currency Asset up to ANY amount.'},
      {ref:'Part B, Para 4',title:'Resident Entity (WITH Domestic Ringgit Borrowing) — investment limits',body:'A Resident Entity WITH Domestic Ringgit Borrowing may invest in FCY Asset up to: (a) any amount using FCY from outside Malaysia (except Export of Goods proceeds) or approved FCY Borrowing; (b) any amount using LOB FCY Borrowing for Direct Investment Abroad (DIA); or (c) RM50 million equivalent per calendar year from conversion of Ringgit, Trade FCA, LOB FCY Borrowing for non-DIA purposes, or swapping of Ringgit-denominated asset. Computed on parent-subsidiary group basis.'},
      {ref:'Part C, Para 5',title:'LOB, Licensed Insurer, Licensed Takaful Operator — own account UNLIMITED',body:'A LOB, licensed insurer or licensed takaful operator may invest in Foreign Currency Asset up to any amount for its own account.'},
      {ref:'Part C, Para 9-10',title:'SC-licensed fund manager — investing offshore on behalf of clients',body:'A Resident Entity licensed by SC to offer unit trust or collective investment scheme may invest in FCY Asset Offshore on behalf of clients up to: (a) full NAV for client without DRB or Non-Resident; (b) full NAV of Shariah-compliant funds; or (c) 50% of NAV for conventional funds belonging to client with DRB. Resident Entity licensed for fund management activities follows similar proportional limits.'},
    ],
    kw:['invest','investment','foreign currency asset','FCY asset','offshore','onshore','domestic ringgit borrowing','DRB','RM1 million','RM50 million','LOB','unit trust','direct investment abroad','DIA','real estate','Trade FCA','unlimited','fund manager','portfolio','securities'] },
  4: { id:4, short:'N4', icon:'ti-arrows-exchange', title:'Payment and Receipt',
    desc:'Permitted Ringgit and foreign-currency payments between Residents and Non-Residents, repatriation, and FCA / External Accounts.',
    secs: [
      {ref:'Part A, Para 1',title:'Payment for approved transaction — general rule',body:'A person is allowed to make or receive a payment arising from any transaction approved in writing by BNM under the FEP Notices or otherwise approved by BNM.'},
      {ref:'Part B, Para 2',title:'Non-Resident — Ringgit payment in Malaysia (permitted purposes)',body:'A Non-Resident is allowed to make or receive payment in Ringgit in Malaysia to/from a Resident or Non-Resident for: (a) any purpose between Immediate Family Members; (b) income earned or expense incurred in Malaysia; or (c) settlement of trade in goods/services, a Ringgit Asset, or commodity murabahah transaction.'},
      {ref:'Part B, Para 3',title:'Non-Resident — Ringgit payment (court judgement, reinsurance)',body:'A Non-Resident is allowed to make/receive Ringgit payment to/from a Resident for: (a) court judgement where underlying transaction complies with FEP Notices; or (b) reinsurance for domestic insurance or retakaful for domestic takaful business.'},
      {ref:'Part C, Para 4',title:'Resident — FCY payment between Residents (permitted purposes)',body:'A Resident may make/receive FCY payment to/from another Resident for: (a) any purpose between Immediate Family Members; (b) education, employment or migration outside Malaysia; (c) transaction with a LOB, licensed international takaful operator; (d) settlement of FCY derivatives on Specified Exchange, commodity murabahah transactions, miscellaneous expenses abroad between Residents, or domestic trade within Global Supply Chain operations in Malaysia (subject to specific conditions).'},
      {ref:'Part C, Para 5',title:'Resident — FCY payment to/from Non-Resident (generally permitted with exceptions)',body:'A Resident is allowed to make/receive FCY payment to/from a Non-Resident for ANY purpose, EXCEPT: (a) FCY-denominated derivatives offered by a Resident (unless approved under Notice 5); (b) derivatives referenced to Ringgit (unless approved); or (c) Exchange Rate Derivative offered by Non-Resident (unless approved under Notice 1).'},
      {ref:'Part C, Para 6',title:'Non-Resident — FCY payment between Non-Residents (any purpose)',body:'A Non-Resident is allowed to make or receive FCY payment in Malaysia to/from another Non-Resident for ANY purpose.'},
      {ref:'Part E, Para 8',title:'Non-Resident — Repatriation of funds from Malaysia',body:'A Non-Resident is allowed to repatriate funds from Malaysia (including income earned and proceeds from divestment of Ringgit Asset), provided that: (a) repatriation is made in Foreign Currency; and (b) conversion of Ringgit into FCY is undertaken per Notice 1 Part B.'},
      {ref:'Part F, Para 9',title:'Non-Resident — External Account (Ringgit account)',body:'A Non-Resident is allowed to open and maintain an External Account (Ringgit account) with a Financial Institution in Malaysia.'},
      {ref:'Part F, Para 14',title:'Resident Individual — Foreign Currency Account (FCA)',body:'A Resident Individual is allowed to open and maintain a FCA with a LOB or NRFI, individually or jointly with another Resident or Non-Resident Individual.'},
      {ref:'Part F, Para 16',title:'Resident Entity — Foreign Currency Account',body:'A Resident Entity is allowed to open and maintain a FCA with a LOB or NRFI, subject to Part B of Notice 3 (investment in FCY Asset limits).'},
      {ref:'Part F, Para 18',title:'Non-Resident — Foreign Currency Account',body:'A Non-Resident is allowed to open and maintain a FCA with a LOB, individually or jointly with a Resident Individual or another Non-Resident.'},
    ],
    kw:['payment','receipt','pay','receive','ringgit payment','FCY payment','foreign currency payment','repatriate','repatriation','external account','FCA','trade','goods','services','education','employment','migration','immediate family','remittance','global supply chain','open account','maintain account'] },
  5: { id:5, short:'N5', icon:'ti-certificate', title:'Securities and Financial Instruments',
    desc:'Issuance and subscription of securities, sukuk, bonds and derivatives by Residents and Non-Residents.',
    secs: [
      {ref:'Part A, Para 1',title:'Resident — issuance of security (Ringgit to NR; FCY to anyone)',body:'A Resident is allowed to issue a security denominated in: (a) Ringgit in Malaysia to a Non-Resident; or (b) Foreign Currency to any person. Where issuance involves a debt security, the Resident issuer shall comply with Notice 2.'},
      {ref:'Part A, Para 2-3',title:'Non-Resident — issuance of security',body:'A Multilateral Development Bank or Qualified DFI may issue a Ringgit debt security in Malaysia to any person (subject to Notice 2). A Non-Resident is allowed to issue a security denominated in Foreign Currency in Malaysia to any person.'},
      {ref:'Part B, Para 4',title:'LOB — issuance of financial instrument',body:'A LOB is allowed to issue or offer a Financial Instrument denominated in: (a) Ringgit in Malaysia to a Non-Resident; or (b) FCY to any person. Where the instrument is referenced to exchange rate, the LOB shall comply with Notice 1.'},
      {ref:'Part B, Para 5',title:'LOB — Ringgit interest rate derivative with Non-Resident',body:'A LOB is allowed to deal in Ringgit-denominated interest rate derivative or profit rate Islamic derivative with a Non-Resident counterparty (directly or via AOO). Where the derivative is an Exchange Rate Derivative or embedded with exchange rate features, Notice 1 must be complied with.'},
      {ref:'Part B, Para 8',title:'Bursa Malaysia — Ringgit financial instrument to Non-Resident',body:'Bursa Malaysia is allowed to issue or offer to a Non-Resident a Financial Instrument denominated in Ringgit, EXCLUDING a Financial Instrument referenced to exchange rate.'},
      {ref:'Part C, Para 9-10',title:'Subscription or transfer of securities or financial instruments',body:'A Resident or Non-Resident is allowed to subscribe to or transfer a security or Financial Instrument issued per this Notice in Malaysia, subject to compliance with Notice 2, Notice 3 and Notice 4.'},
    ],
    kw:['security','securities','financial instrument','bond','sukuk','share','equity','issue','issuance','derivative','interest rate derivative','Bursa Malaysia','LOB','exchange rate derivative','subscription','transfer','corporate bond','redeemable preference shares','RPS'] },
  6: { id:6, short:'N6', icon:'ti-plane-departure', title:'Import and Export of Currency',
    desc:'Carrying cash across the Malaysian border — traveller limits for Ringgit and foreign currency notes, and customs declarations.',
    secs: [
      {ref:'Para 1(1)',title:'Import and export of currency — governed by Gazette Notice G.N. 38691/2013',body:'All importation and exportation of currency shall be made in accordance with the Notice on Import and Export of Currencies, Securities, Islamic Securities, Financial Instruments and Islamic Financial Instruments 2013 [G.N. 38691/2013], effective 2 December 2013.'},
      {ref:'Gazette Notice',title:'Traveller importing Ringgit into Malaysia',body:'A traveller entering Malaysia is allowed to bring in Ringgit currency notes. Import of Ringgit above RM10,000 must be declared to customs upon arrival. Amounts above the declarable threshold brought in without declaration are not permitted.'},
      {ref:'Gazette Notice',title:'Traveller exporting Ringgit out of Malaysia',body:'A traveller leaving Malaysia is allowed to bring out Ringgit currency notes up to RM1,000 per trip only. Export of Ringgit ABOVE RM1,000 is NOT PERMITTED under any circumstances.'},
      {ref:'Gazette Notice',title:'Traveller importing or exporting Foreign Currency',body:'A traveller may bring in or take out Foreign Currency notes. Amounts exceeding RM30,000 equivalent in Foreign Currency must be declared to the Royal Malaysian Customs Department. There is no upper limit on FCY import/export but declaration is mandatory above RM30,000 equivalent. Failure to declare is a violation.'},
      {ref:'Gazette Notice',title:'Non-traveller import/export of currency',body:'Entities (e.g. courier, postal services) importing or exporting currency must comply with Gazette Notice conditions or obtain specific BNM approval. Bulk cash movements by financial institutions follow separate LOB guidelines.'},
    ],
    kw:['import','export','traveller','cash','currency notes','ringgit','carry','bring','border','customs','RM10,000','RM1,000','RM30,000','declaration','declare','physical currency','notes','coins','bulk cash','smuggle'] },
  7: { id:7, short:'N7', icon:'ti-ship', title:'Export of Goods',
    desc:'Export proceeds rules — full value, the 6-month receipt window, approved deductions, offsetting and BNM reporting duties.',
    secs: [
      {ref:'Part A, Para 1(a)',title:'Resident exporter — receipt of export proceeds (currency and account)',body:'A Resident exporter SHALL receive the proceeds of its Export of Goods in Malaysia: in Ringgit or Foreign Currency, placed in a Ringgit account or Trade FCA maintained with a LOB.'},
      {ref:'Part A, Para 1(b)',title:'Resident exporter — receipt in FULL VALUE (approved deductions allowed)',body:'Export proceeds must be received in FULL VALUE excluding: (i) approved deductions (Appendix A): agency commission, advertising/promotion, freight, insurance/takaful, administrative error, exporter discount, quality/quantity claim, short-shipment, shut-out, fraud write-off, value-added-only goods, buyer liquidation; and (ii) approved offsetting/writing-off per Appendix B.'},
      {ref:'Part A, Para 1(c)',title:'Export proceeds timeline — 6 months standard; 24 months for approved circumstances',body:'Export proceeds must be received within the export contract payment date, NOT EXCEEDING SIX (6) MONTHS from date of shipment. EXCEPTION (Appendix C): proceeds may be received up to TWENTY-FOUR (24) MONTHS from shipment where: buyer is in financial difficulties; buyer cancels/disputes/delays/does not respond; FCY restrictions in buyer\'s country; quality/quantity claims; fraud; or credit terms up to 24 months for consignment sales or goods requiring testing and commissioning.'},
      {ref:'Part A, Para 2',title:'Exemption — export proceeds receipt obligation does NOT apply',body:'The receipt obligation does NOT apply (Appendix D) where goods exported under: (a) a border trade agreement between Malaysian Government and foreign government; or (b) goods not for sale: gifts, donations, personal effects, business samples; goods for processing/testing/repair/exhibition/exchange that will be reimported; or goods belonging to Non-Resident exported after exhibition or lease/rental expiry.'},
      {ref:'Part B, Para 3',title:'Non-Resident — permissible sources for Ringgit payment of export proceeds',body:'Where a Non-Resident settles for Export of Goods in Ringgit in Malaysia, Ringgit shall be sourced from: (a) buying Ringgit against FCY per Notice 1 Part B; (b) External Account of the Non-Resident; (c) External Account of NRFI acting on behalf of Non-Resident; or (d) Ringgit trade financing from LOB per Notice 2 Part D.'},
      {ref:'Part C, Para 4',title:'Reporting obligation — large exporters with annual gross Export >RM250M',body:'Where a Resident exporter\'s annual gross Export of Goods exceeds RM250 million equivalent in the preceding year, the Resident exporter shall submit a report to BNM via https://bnm.my/fep as and when required by BNM.'},
      {ref:'Part C, Para 5',title:'Reporting obligation — proceeds not received within 24 months',body:'Where export proceeds are not received within 24 months from the date of shipment, the Resident exporter shall notify BNM on the outstanding proceeds within TWENTY-ONE (21) DAYS after the end of each calendar year via https://bnm.my/fep.'},
      {ref:'Appendix B',title:'Approved offsetting and writing-off arrangements for export proceeds',body:'A Resident exporter may receive less than full value where it enters into: (a) offsetting arrangement with Non-Resident to offset export proceeds with imports of goods/services by exporter, warranty claims, dividend payments, other Current Account Transactions, or repayment of FCY Borrowing under Notice 2; or (b) writing-off arrangement where Non-Resident buyer is in liquidation, or proceeds cannot be received after at least 24 months from shipment despite following up.'},
    ],
    kw:['export','export proceeds','receipt','payment','shipment','6 months','24 months','RM250 million','reporting','exporter','deduction','freight','insurance','commission','Trade FCA','offsetting','write-off','consignment','border trade','gift','sample','notify BNM','repatriate export'] },
};

const CHUNKS = [];
Object.values(NOTICES).forEach(n => n.secs.forEach(s =>
  CHUNKS.push({ noticeId:n.id, noticeName:n.short, noticeTitle:n.title, ref:s.ref, title:s.title, body:s.body })));

/* ━━━ GLOSSARY ━━━ */
const GLOSSARY = {
  'Resident': 'A Malaysian citizen (excluding citizens with permanent residence abroad who reside abroad), a body incorporated in Malaysia, or the Malaysian Government.',
  'Non-Resident': 'Any person other than a Resident — including overseas branches of Malaysian companies and Malaysians with foreign PR residing abroad.',
  'LOB': 'Licensed Onshore Bank — a licensed bank, investment bank or Islamic bank under the FSA / IFSA.',
  'AOO': 'Appointed Overseas Office — an overseas office of a LOB\'s banking group approved by BNM to facilitate Ringgit transactions for Non-Residents.',
  'NRFI': 'Non-Resident Financial Institution — a Non-Resident entity undertaking financial services.',
  'DRB': 'Domestic Ringgit Borrowing — any Ringgit borrowing obtained by a Resident from another Resident (excluding one housing loan, one vehicle loan, and sundry/employee facilities).',
  'FCA': 'Foreign Currency Account maintained with a LOB or NRFI — split into Trade FCA and Investment FCA.',
  'Trade FCA': 'Foreign Currency Account used for trade-related receipts and payments, including export proceeds.',
  'External Account': 'A Ringgit account opened by a Non-Resident with a Financial Institution in Malaysia.',
  'DIA': 'Direct Investment Abroad — an investment resulting in at least 10% equity ownership or control of a Non-Resident entity.',
  'Firm Commitment': 'An obligation to pay or right to receive, or a holding of an asset, debt or liability — the documentary basis for a forward contract.',
  'Anticipatory': 'A projected transaction based on previous track record or supporting documents.',
  'Group': 'An entity\'s holding/parent (>50%), head office, branches, subsidiaries (>50%), associates (10–50%) and sister companies with a common shareholder of at least 10%.',
  'SPV': 'Special Purpose Vehicle — an entity set up solely for the purpose of obtaining borrowing.',
  'Export Proceeds': 'The full value receivable from an Export of Goods, to be received in Malaysia within 6 months of shipment (up to 24 months in approved circumstances).',
  'Spot Basis': 'Settlement within two business days of the FX transaction.',
  'Forward Basis': 'Settlement beyond two business days at a rate agreed today — requires a Firm Commitment or Anticipatory basis.',
  'Real Sector Activity': 'Activities relating to production or consumption of goods and services in Malaysia, excluding activities of a financial nature.',
};

/* ━━━ QUICK-CHECK DECISION TREES (“Am I Affected?”) ━━━ */
const QUICKCHECK = {
  1: { start:'a', nodes:{
      a:{ q:'Are you (or your customer) exchanging foreign currency against Ringgit or another currency?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 1 governs buying/selling foreign currency, forwards and gold dealings. If no currency exchange or hedging is involved, look at Notices 2–7 instead.' } },
      b:{ q:'Is the transaction with a Licensed Onshore Bank (LOB) or licensed money changer?', yes:'c', no:{ type:'warn', t:'Affected — review counterparty', d:'FX dealings must generally be carried out with a LOB, an Appointed Overseas Office or a licensed money changer. Dealing through other channels may breach Notice 1. Ask the AI Advisor with your specifics.' } },
      c:{ q:'Is it a forward / hedging contract (settlement beyond spot)?', yes:{ type:'info', t:'Affected — forward rules apply', d:'Forwards require a Firm Commitment or Anticipatory basis and must be unwound if the commitment ceases. Non-Residents face extra restrictions (N1 Part B, Para 12). Institutional investors may need Dynamic Hedging registration.' }, no:{ type:'ok', t:'Affected, but generally permitted', d:'Spot dealings with a LOB or licensed money changer are broadly permitted for both Residents and Non-Residents (N1 Paras 1, 6, 14).' } },
  }},
  2: { start:'a', nodes:{
      a:{ q:'Does the arrangement involve borrowing, lending or a guarantee across Resident / Non-Resident lines?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Purely domestic Ringgit lending between Residents is outside Notice 2\'s cross-border scope (but may count as Domestic Ringgit Borrowing for Notice 3 limits).' } },
      b:{ q:'Is the borrower a Resident individual / sole proprietor?', yes:{ type:'warn', t:'Affected — individual limits apply', d:'Ringgit borrowing from a Non-Resident is capped at RM1 million aggregate (unlimited from immediate family/employer). Foreign currency borrowing is capped at RM10 million equivalent from a LOB or Non-Resident (N2 Part A).' }, no:'c' },
      c:{ q:'Is the borrower a Resident company borrowing in foreign currency from outside its Group?', yes:{ type:'warn', t:'Affected — RM100M group limit', d:'FCY borrowing from a Non-Resident outside the Group, an NRFI or an out-of-group SPV is capped at RM100 million equivalent on a group basis (N2 Part B, Para 10). Borrowing from a LOB, Group entity or direct shareholder is unlimited.' }, no:{ type:'info', t:'Affected — check the matching provision', d:'Non-Resident borrowing and guarantees have their own permissions (N2 Parts D–G). Open Notice 2 and find the row matching your borrower and lender, or ask the AI Advisor.' } },
  }},
  3: { start:'a', nodes:{
      a:{ q:'Is a Resident investing in a foreign-currency asset (shares, property, deposits, funds abroad)?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 3 only governs Resident investment in Foreign Currency Assets. Non-Resident investment into Malaysia is generally a Notice 4 (payments) matter.' } },
      b:{ q:'Does the investor have any Domestic Ringgit Borrowing (e.g. business loans; excluding one housing & one vehicle loan)?', yes:'c', no:{ type:'ok', t:'Affected, but unlimited', d:'A Resident without Domestic Ringgit Borrowing may invest any amount in FCY assets, onshore or offshore (N3 Paras 1 & 3).' } },
      c:{ q:'Will the investment be funded by converting Ringgit (or Trade FCA / swapping Ringgit assets)?', yes:{ type:'warn', t:'Affected — annual conversion limits', d:'With DRB, conversion-funded investment is capped per calendar year: RM1 million equivalent for individuals, RM50 million equivalent for entities on a group basis (N3 Paras 2 & 4). Exceeding the cap needs BNM approval — track it on your Dashboard.' }, no:{ type:'ok', t:'Affected, but generally permitted', d:'Investment funded from FCY earned abroad (except export proceeds) or approved FCY borrowing is allowed in any amount (N3 Paras 2(a) & 4(a)).' } },
  }},
  4: { start:'a', nodes:{
      a:{ q:'Is a payment being made or received between a Resident and a Non-Resident (or in foreign currency between Residents)?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Ringgit payments between Residents in Malaysia are not restricted by Notice 4.' } },
      b:{ q:'Is the payment in foreign currency from a Resident to a Non-Resident?', yes:{ type:'ok', t:'Affected, but broadly permitted', d:'FCY payments from a Resident to a Non-Resident are allowed for ANY purpose except certain derivative transactions (N4 Para 5). Note: investment-type payments still count toward Notice 3 limits.' }, no:'c' },
      c:{ q:'Is a Non-Resident receiving or paying Ringgit in Malaysia?', yes:{ type:'info', t:'Affected — purpose test applies', d:'Ringgit payments involving Non-Residents are allowed for listed purposes: income/expenses in Malaysia, trade settlement, Ringgit assets, family transfers (N4 Paras 2–3). Repatriation must be in foreign currency (Para 8).' }, no:{ type:'info', t:'Affected — check FCY-between-Residents rules', d:'FCY payments between Residents are only permitted for listed purposes — family, education/employment/migration abroad, LOB transactions, global supply chain operations (N4 Para 4).' } },
  }},
  5: { start:'a', nodes:{
      a:{ q:'Is someone issuing, subscribing to or transferring securities or financial instruments (bonds, sukuk, shares, derivatives)?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 5 only covers issuance and dealing in securities and financial instruments.' } },
      b:{ q:'Is the issuer a Resident issuing in Ringgit to Non-Residents, or anyone issuing FCY instruments in Malaysia?', yes:{ type:'info', t:'Affected — generally permitted with conditions', d:'Resident issuance of Ringgit securities to Non-Residents and FCY securities to anyone is permitted; debt securities must also comply with Notice 2 borrowing limits (N5 Part A). Exchange-rate-linked instruments trigger Notice 1.' }, no:{ type:'info', t:'Affected — check the issuer-specific rule', d:'MDB/QDFI Ringgit issuances, LOB instruments and Bursa products each have their own provision (N5 Parts A–B). Open Notice 5 or ask the AI Advisor.' } },
  }},
  6: { start:'a', nodes:{
      a:{ q:'Is physical cash (notes) being carried, couriered or posted across the Malaysian border?', yes:'b', no:{ type:'ok', t:'Not affected', d:'Notice 6 only covers physical import/export of currency. Electronic transfers fall under Notice 4.' } },
      b:{ q:'Is Ringgit being taken OUT of Malaysia?', yes:{ type:'warn', t:'Affected — strict RM1,000 cap', d:'A traveller may take out at most RM1,000 in Ringgit notes per trip — amounts above that are NOT permitted under any circumstances. Foreign currency above RM30,000 equivalent must be declared to Customs.' }, no:{ type:'info', t:'Affected — declaration thresholds', d:'Bringing Ringgit IN above RM10,000 or foreign currency above RM30,000 equivalent must be declared to the Royal Malaysian Customs Department. Failure to declare is a violation.' } },
  }},
  7: { start:'a', nodes:{
      a:{ q:'Is a Malaysian (Resident) business exporting goods out of Malaysia?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 7 applies to Resident exporters of goods. Services exports and Non-Resident shipments are outside its scope.' } },
      b:{ q:'Will payment be received within 6 months of shipment, in full value, into a Ringgit account or Trade FCA in Malaysia?', yes:'c', no:{ type:'warn', t:'Affected — timing/value rules engaged', d:'Proceeds beyond 6 months are only allowed in approved circumstances (up to 24 months — buyer difficulties, disputes, consignment, testing). Proceeds still outstanding after 24 months must be reported to BNM within 21 days after year-end (N7 Paras 1(c) & 5).' } },
      c:{ q:'Did annual gross exports exceed RM250 million equivalent last year?', yes:{ type:'info', t:'Affected — reporting obligation', d:'Large exporters (>RM250M/year) must submit reports to BNM via bnm.my/fep as and when required (N7 Para 4). Day-to-day receipts look compliant.' }, no:{ type:'ok', t:'Affected, and compliant pattern', d:'Receiving full value within 6 months into a Ringgit account or Trade FCA with a LOB matches the standard Notice 7 obligations. Keep records of any deductions (Appendix A).' } },
  }},
};

/* ━━━ BM25 RETRIEVAL ENGINE ━━━ */
const STOPS = new Set('the a an and or but in on at to for of with by from is are was were be been have has had do does did will would could should may might must shall can any all this that these those it its they them their which who whom where when how what why not no nor into as if so then than though although because while after before since until upon via per'.split(' '));
const tok = t => t.toLowerCase().replace(/[^a-z0-9]/g,' ').split(/\s+/).filter(w => w.length > 2 && !STOPS.has(w));

let BM25 = null;
function buildBM25() {
  const N = CHUNKS.length, df = {};
  const docs = CHUNKS.map(c => {
    const terms = tok(c.title + ' ' + c.body + ' ' + c.noticeName + ' ' + c.ref);
    const tf = {}; terms.forEach(t => tf[t] = (tf[t]||0)+1);
    return { tf, len: terms.length };
  });
  docs.forEach(d => Object.keys(d.tf).forEach(t => df[t] = (df[t]||0)+1));
  BM25 = { N, df, docs, avgdl: docs.reduce((s,d)=>s+d.len,0)/N };
}
function retrieve(query, noticeFilter='all', k=5) {
  if (!BM25) buildBM25();
  const { N, df, docs, avgdl } = BM25, K1=1.5, B=0.75;
  const qterms = tok(query);
  if (!qterms.length) return CHUNKS.slice(0,k);
  return CHUNKS.map((c,i) => {
    if (noticeFilter !== 'all' && c.noticeId !== parseInt(noticeFilter)) return { c, s:-1 };
    const { tf, len } = docs[i]; let s = 0;
    qterms.forEach(t => {
      const f = tf[t]||0; if (!f) return;
      const idf = Math.log((N-(df[t]||0)+0.5)/((df[t]||0)+0.5)+1);
      s += idf * (f*(K1+1)) / (f + K1*(1-B+B*len/avgdl));
    });
    return { c, s };
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,k).map(x=>x.c);
}

/* ━━━ STATE ━━━ */
const DEFAULT_CFG = { provider:'gemini', apiKey:'', model:'gemini-2.5-flash', ollamaUrl:'http://localhost:11434', ollamaModel:'qwen2.5:7b' };
const DEFAULT_LIMITS = [
  { id:'n3i', label:'Individual FCY investment', notice:'Notice 3 · with DRB', limit:1000000, used:0 },
  { id:'n2i', label:'Individual FCY borrowing', notice:'Notice 2 · Part A', limit:10000000, used:0 },
  { id:'n3e', label:'Entity FCY investment', notice:'Notice 3 · group basis', limit:50000000, used:0 },
];
const DEFAULT_DECLS = [
  { id:1, t:'Export proceeds — Q1 shipment approaching 6-month window', d:'Notice 7 · due 30 Jun 2026', done:false },
  { id:2, t:'Dynamic hedging quarterly position update', d:'Notice 1 · bnm.my/fep', done:false },
];

const ST = {
  tab:'dashboard',
  cfg: { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem('fep_cfg')||'{}') },
  limits: JSON.parse(localStorage.getItem('fep_limits')||'null') || DEFAULT_LIMITS,
  decls: JSON.parse(localStorage.getItem('fep_decls')||'null') || DEFAULT_DECLS,
  sessions: JSON.parse(localStorage.getItem('fep_sess')||'[]'),
  msgs: [], loading:false, advisorFilter:'all',
  toolTab:'scan', analystImport:null, modalNotice:null,
};
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtRM = n => 'RM ' + Number(n||0).toLocaleString('en-MY');

function mkEl(tag, cls, html) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html !== undefined) el.innerHTML = html;
  return el;
}
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.add('hidden'), 2600);
}

/* wrap glossary terms in text with clickable chips */
function linkTerms(html) {
  const terms = Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length);
  const re = new RegExp('\\b(' + terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|') + ')\\b', 'g');
  return html.replace(re, m => `<button class="term" data-term="${esc(m)}">${esc(m)}</button>`);
}

/* ━━━ AI PROVIDERS ━━━ */
function baseDefinitions() {
  return Object.entries(GLOSSARY).map(([k,v]) => `${k}=${v}`).join('\n');
}
function buildSystemPrompt(chunks, extra='') {
  const kb = chunks.map(c => `[${c.noticeName} — ${c.ref}] ${c.title}\n${c.body}`).join('\n\n');
  return `You are an expert BNM (Bank Negara Malaysia) Foreign Exchange Policy (FEP) compliance analyst assisting Malaysian banking officers. FEP Notices effective: 1 October 2025.

KEY DEFINITIONS:
${baseDefinitions()}

RETRIEVED KNOWLEDGE BASE (most relevant provisions for this query):
${kb}
${extra}
INSTRUCTIONS: Respond ONLY in valid JSON with this exact structure — no text before or after:
{
  "verdict": "PERMITTED" | "NOT_PERMITTED" | "CONDITIONAL" | "REQUIRES_APPROVAL",
  "summary": "One concise sentence stating the verdict",
  "explanation": "2-4 sentences explaining the applicable rule, key criteria, and any thresholds",
  "citation": "FEP Notice X, [Ref] — Section Title",
  "conditions": ["condition if CONDITIONAL, else empty array"],
  "warning": "Important caveat or null",
  "nextStep": "The exact next action: which BNM submission/registration/report applies (via https://bnm.my/fep) or 'No filing required' "
}

VERDICT DEFINITIONS:
PERMITTED = explicitly allowed without restriction
NOT_PERMITTED = explicitly prohibited
CONDITIONAL = allowed only under specific conditions (list them)
REQUIRES_APPROVAL = needs prior BNM written approval

RULES:
1. Base your answer ONLY on the retrieved knowledge base above
2. Always cite the specific FEP Notice and paragraph reference
3. State assumptions if the question is ambiguous
4. If not covered in the knowledge base, say so — never fabricate
5. For complex cases, recommend the BNM FEP portal: ${BNM_NOTICES_URL}
6. Return ONLY valid JSON. No markdown, no code fences, no preamble.`;
}

async function callGemini(query, chunks, history=[]) {
  const { apiKey, model } = ST.cfg;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      system_instruction:{ parts:[{ text: buildSystemPrompt(chunks) }] },
      contents:[...history.map(m=>({ role:m.role==='assistant'?'model':'user', parts:[{text:m.content}] })), { role:'user', parts:[{text:query}] }],
      generationConfig:{
        temperature:0.05, maxOutputTokens:4096, responseMimeType:'application/json',
        // 2.5-flash spends "thinking" tokens from the same budget — disable so the JSON never truncates
        ...(model.includes('flash') ? { thinkingConfig:{ thinkingBudget:0 } } : {})
      }
    })
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || `Gemini API error ${res.status}`); }
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOllama(query, chunks, history=[]) {
  const { ollamaUrl, ollamaModel } = ST.cfg;
  const messages = [{ role:'system', content: buildSystemPrompt(chunks) },
    ...history.map(m=>({ role:m.role==='assistant'?'assistant':'user', content:m.content })),
    { role:'user', content: query }];
  const res = await fetch(`${ollamaUrl}/v1/chat/completions`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ model: ollamaModel, messages, temperature:0.05, stream:false })
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Model "${ollamaModel}" not found. Run: ollama pull ${ollamaModel}`);
    const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || `Ollama error ${res.status}`);
  }
  const d = await res.json();
  return d.choices?.[0]?.message?.content || '';
}

const callAI = (q, chunks, hist) => ST.cfg.provider === 'ollama' ? callOllama(q, chunks, hist) : callGemini(q, chunks, hist);
const aiConfigured = () => ST.cfg.provider === 'ollama' || !!ST.cfg.apiKey;

/* Repair truncated JSON: close an unterminated string, drop a dangling
   key/value fragment, then close unbalanced brackets in nesting order. */
function repairJSON(s) {
  let inStr = false, escNext = false; const stack = [];
  for (const ch of s) {
    if (escNext) { escNext = false; continue; }
    if (inStr) {
      if (ch === '\\') escNext = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }
  let out = s;
  if (inStr) out += '"';
  out = out
    .replace(/,\s*"(?:[^"\\]|\\.)*"\s*:?\s*$/, '')      // dangling ,"key" or ,"key":
    .replace(/(\{\s*)"(?:[^"\\]|\\.)*"\s*:?\s*$/, '$1') // {"key": with no value yet
    .replace(/[,:]\s*$/, '');                           // bare trailing comma/colon
  while (stack.length) out += stack.pop() === '{' ? '}' : ']';
  return out;
}
function parseResp(raw) {
  if (!raw) return { ok:false, raw:'' };
  const tryParse = s => { try { const p = JSON.parse(s); if (p && p.verdict) return p; } catch(_){} return null; };
  let p = tryParse(raw.trim());
  let truncated = false;
  if (!p) {
    const m = raw.replace(/```json\s*|\s*```/g,'').match(/\{[\s\S]*/);
    if (m) {
      p = tryParse(m[0]);
      if (!p) { p = tryParse(repairJSON(m[0].trim())); truncated = !!p; }
    }
  }
  if (p) return { ok:true, partial:truncated, data:p };
  // regex salvage — tolerate a missing closing quote at end-of-string
  const f = {};
  ['verdict','summary','explanation','citation','warning','nextStep'].forEach(k => {
    f[k] = (raw.match(new RegExp(`"${k}"\\s*:\\s*"([^"]*)`))||[])[1];
  });
  if (f.verdict && f.summary) return { ok:true, partial:true, data:{ ...f, explanation: f.explanation||'See raw response.', conditions:[] } };
  return { ok:false, raw };
}

/* ━━━ VERDICT CARD ━━━ */
const VCFG = {
  PERMITTED:         { cls:'permitted',         icon:'ti-circle-check',  label:'PERMITTED' },
  NOT_PERMITTED:     { cls:'not-permitted',     icon:'ti-circle-x',      label:'NOT PERMITTED' },
  CONDITIONAL:       { cls:'conditional',       icon:'ti-alert-circle',  label:'CONDITIONAL' },
  REQUIRES_APPROVAL: { cls:'requires-approval', icon:'ti-lock',          label:'REQUIRES APPROVAL' },
};
function verdictCard(data, chunks, isPartial) {
  const vc = VCFG[data.verdict] || VCFG.CONDITIONAL;
  const card = mkEl('div','vcard');
  card.appendChild(mkEl('div','vcard-head',
    `<span class="vbadge ${vc.cls}"><i class="ti ${vc.icon}"></i>${vc.label}</span><span class="vsummary">${esc(data.summary)}</span>`));
  const body = mkEl('div','vbody', `<div class="vlabel">Explanation</div><p>${esc(data.explanation)}</p>`);
  if (data.conditions?.length)
    body.innerHTML += `<div class="vlabel" style="margin-top:10px">Conditions</div>` +
      data.conditions.map(c=>`<div class="vcond"><i class="ti ti-point-filled"></i><span>${esc(c)}</span></div>`).join('');
  if (data.warning && data.warning !== 'null')
    body.innerHTML += `<div class="vwarn"><i class="ti ti-alert-triangle" style="vertical-align:-2px;margin-right:5px"></i>${esc(data.warning)}</div>`;
  if (data.nextStep && data.nextStep !== 'null')
    body.innerHTML += `<div class="vnext"><i class="ti ti-arrow-guide" style="vertical-align:-2px;margin-right:5px"></i><strong>Next step:</strong> ${esc(data.nextStep)}</div>`;
  if (isPartial)
    body.innerHTML += `<div class="vwarn" style="margin-top:8px">Response partially parsed — some fields may be incomplete.</div>`;
  card.appendChild(body);
  if (data.citation) card.appendChild(mkEl('div','vcite',`<div class="vlabel">BNM Citation</div><div class="vcite-text">${esc(data.citation)}</div>`));
  if (chunks?.length) {
    const srcs = mkEl('div','vsources'); const seen = new Set();
    chunks.forEach(c => { const k = `${c.noticeName} ${c.ref}`; if (!seen.has(k)) { seen.add(k); srcs.appendChild(mkEl('span','vsrc-tag',esc(k))); } });
    card.appendChild(srcs);
  }
  return card;
}
function rawCard(raw) {
  const w = mkEl('div','');
  w.appendChild(mkEl('div','msg-raw-label','<i class="ti ti-alert-circle"></i>Raw AI response — could not parse a structured verdict'));
  w.appendChild(mkEl('div','msg-raw', esc(raw)));
  return w;
}
function provisionList(chunks, title='Most relevant provisions (reference lookup)') {
  const w = mkEl('div','');
  w.appendChild(mkEl('div','sec-hdr', title));
  chunks.forEach(c => {
    const card = mkEl('div','result-card',
      `<span class="rtag">${c.noticeName}</span><span class="rref">${esc(c.ref)}</span>
       <div class="rtitle">${esc(c.title)}</div><div class="rexcerpt">${esc(c.body)}</div>`);
    w.appendChild(card);
  });
  return w;
}

/* ━━━ NAVIGATION ━━━ */
function switchTab(tab) {
  ST.tab = tab;
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-'+tab));
  document.querySelectorAll('.side-link, .bb-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'dashboard') renderDashboard();
}
document.querySelectorAll('.side-link, .bb-tab').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
  switchTab(b.dataset.go);
  if (b.dataset.tool) switchTool(b.dataset.tool);
}));

/* ━━━ DASHBOARD ━━━ */
function ringSVG(pct, color) {
  const r = 30, c = 2*Math.PI*r, off = c*(1-Math.min(pct,1));
  return `<svg class="ring-svg" width="76" height="76" viewBox="0 0 76 76">
    <circle class="track" cx="38" cy="38" r="${r}" fill="none" stroke-width="7"/>
    <circle class="val" cx="38" cy="38" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 38 38)"/>
    <text class="ring-pct" x="38" y="43" text-anchor="middle">${Math.round(pct*100)}%</text>
  </svg>`;
}
function renderRings() {
  const wrap = $('rings'); wrap.innerHTML = '';
  ST.limits.forEach(L => {
    const pct = L.used / L.limit;
    const color = pct >= .9 ? 'var(--red)' : pct >= .7 ? 'var(--amber)' : 'var(--teal)';
    const card = mkEl('div','ring-card');
    card.innerHTML = ringSVG(pct, color) +
      `<div class="ring-info"><div class="t">${esc(L.label)}</div>
       <div class="v">${fmtRM(L.used)} / ${fmtRM(L.limit)}</div>
       <div class="n">${esc(L.notice)}</div></div>`;
    card.title = 'Click to update utilised amount';
    card.addEventListener('click', () => {
      if (card.querySelector('.ring-edit')) return;
      const ed = mkEl('div','ring-edit');
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = 0; inp.value = L.used; inp.placeholder = 'Utilised (RM)';
      const ok = mkEl('button','ghost-btn','<i class="ti ti-check"></i>');
      ed.appendChild(inp); ed.appendChild(ok);
      card.querySelector('.ring-info').appendChild(ed);
      inp.focus();
      const commit = () => {
        const v = Math.max(0, Number(inp.value)||0);
        L.used = v; save('fep_limits', ST.limits); renderRings();
        toast(`${L.label} updated — ${Math.round(v/L.limit*100)}% utilised`);
      };
      ok.addEventListener('click', e => { e.stopPropagation(); commit(); });
      inp.addEventListener('keydown', e => { if (e.key==='Enter') commit(); });
      inp.addEventListener('click', e => e.stopPropagation());
    });
    wrap.appendChild(card);
  });
}
function renderDecls() {
  const ul = $('decl-list'); ul.innerHTML = '';
  if (!ST.decls.length) { ul.appendChild(mkEl('li','decl-empty','No pending declarations — all clear ✓')); return; }
  ST.decls.forEach(d => {
    const li = mkEl('li', 'decl-item'+(d.done?' done':''));
    li.innerHTML = `<button class="decl-check"><i class="ti ti-check"></i></button>
      <div><div class="decl-t">${esc(d.t)}</div><div class="decl-d">${esc(d.d)}</div></div>
      <button class="decl-del" title="Remove"><i class="ti ti-trash"></i></button>`;
    li.querySelector('.decl-check').addEventListener('click', () => { d.done = !d.done; save('fep_decls', ST.decls); renderDecls(); });
    li.querySelector('.decl-del').addEventListener('click', () => { ST.decls = ST.decls.filter(x=>x.id!==d.id); save('fep_decls', ST.decls); renderDecls(); });
    ul.appendChild(li);
  });
}
$('decl-add').addEventListener('click', () => {
  const ul = $('decl-list');
  if (ul.querySelector('.decl-new')) { ul.querySelector('.decl-new input').focus(); return; }
  const li = mkEl('li','decl-item decl-new');
  li.innerHTML = `<input type="text" maxlength="120" placeholder="Describe the declaration / task…"
      style="flex:1;border:1.5px solid var(--bdr2);border-radius:7px;background:var(--surf);padding:8px 10px;font-size:16px;outline:none">
    <button class="ghost-btn"><i class="ti ti-check"></i> Save</button>`;
  const inp = li.querySelector('input');
  li.querySelector('button').addEventListener('click', () => {
    const t = inp.value.trim();
    if (!t) { li.remove(); return; }
    ST.decls.push({ id:Date.now(), t, d:'Added '+new Date().toLocaleDateString('en-MY',{day:'numeric',month:'short',year:'numeric'}), done:false });
    save('fep_decls', ST.decls); renderDecls();
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') li.querySelector('button').click();
    if (e.key === 'Escape') li.remove();
  });
  ul.prepend(li); inp.focus();
});
function renderDashNotices() {
  const wrap = $('dash-notices'); wrap.innerHTML = '';
  Object.values(NOTICES).forEach(n => {
    const b = mkEl('button','mini-notice',`<div class="mn-tag">NOTICE ${n.id}</div><div class="mn-t">${esc(n.title)}</div>`);
    b.addEventListener('click', () => openNotice(n.id));
    wrap.appendChild(b);
  });
}
function renderDashboard() {
  const h = new Date().getHours();
  $('greeting').textContent = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  renderRings(); renderDecls();
}

/* ━━━ NOTICES HUB ━━━ */
function renderNoticeCards() {
  const wrap = $('notices-cards'); wrap.innerHTML = '';
  Object.values(NOTICES).forEach(n => {
    const card = mkEl('article','notice-card');
    card.innerHTML = `
      <div class="nc-top"><div class="nc-num">${n.id}</div><div class="nc-title">${esc(n.title)}</div></div>
      <div class="nc-desc">${esc(n.desc)}</div>
      <div class="nc-meta">${n.secs.length} provisions · effective 1 Oct 2025</div>
      <div class="nc-actions">
        <button class="btn primary act-explore"><i class="ti ti-book-2"></i> Explore</button>
        <button class="btn act-check"><i class="ti ti-help-hexagon"></i> Am I Affected?</button>
        <a class="btn" href="${BNM_NOTICES_URL}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i> Full Notice</a>
      </div>`;
    card.querySelector('.act-explore').addEventListener('click', () => openNotice(n.id));
    card.querySelector('.act-check').addEventListener('click', () => openQuickCheck(n.id));
    wrap.appendChild(card);
  });
}
function renderGlossary() {
  const g = $('glossary'); g.innerHTML = '';
  Object.keys(GLOSSARY).forEach(t => g.appendChild(mkEl('button','term', esc(t))).setAttribute('data-term', t));
}
function renderNoticeSearch() {
  const q = $('notices-q').value.trim();
  $('notices-clear').classList.toggle('visible', !!q);
  const out = $('notices-results'); out.innerHTML = '';
  $('notices-cards').style.display = q ? 'none' : '';
  if (!q) return;
  const ql = q.toLowerCase();
  let results = CHUNKS.filter(c => (c.title+' '+c.body+' '+c.noticeName+' '+c.ref).toLowerCase().includes(ql));
  if (!results.length) results = retrieve(q, 'all', 8);
  if (!results.length) { out.appendChild(mkEl('div','empty-center',`<i class="ti ti-mood-sad"></i><p>No provisions match “${esc(q)}”.</p>`)); return; }
  out.appendChild(mkEl('div','sec-hdr',`${results.length} matching provision${results.length!==1?'s':''}`));
  const hl = t => q ? esc(t).replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>') : esc(t);
  results.slice(0,20).forEach(c => {
    const card = mkEl('div','result-card',
      `<span class="rtag">${c.noticeName}</span><span class="rref">${esc(c.ref)}</span>
       <div class="rtitle">${hl(c.title)}</div><div class="rexcerpt">${hl(c.body)}</div>`);
    card.addEventListener('click', () => openNotice(c.noticeId, c.ref));
    out.appendChild(card);
  });
}
$('notices-q').addEventListener('input', renderNoticeSearch);
$('notices-clear').addEventListener('click', () => { $('notices-q').value=''; renderNoticeSearch(); });

/* notice detail modal */
function openNotice(id, focusRef) {
  const n = NOTICES[id]; if (!n) return;
  ST.modalNotice = id;
  $('nm-tag').textContent = `NOTICE ${n.id} · ${n.secs.length} PROVISIONS`;
  $('nm-name').textContent = n.title;
  $('nm-fulltext').href = BNM_NOTICES_URL;
  const body = $('nm-body'); body.innerHTML = '';
  body.appendChild(mkEl('div','sec-hdr','Tap any provision to expand · dotted terms have definitions'));
  n.secs.forEach(s => {
    const prov = mkEl('div','prov');
    const head = mkEl('button','prov-head',
      `<span class="prov-ref">${esc(s.ref)}</span><span class="prov-title">${esc(s.title)}</span><i class="ti ti-chevron-down prov-chev"></i>`);
    const bwrap = mkEl('div','prov-body');
    bwrap.appendChild(mkEl('div','prov-body-inner', linkTerms(esc(s.body))));
    head.addEventListener('click', () => {
      const open = prov.classList.toggle('open');
      bwrap.style.maxHeight = open ? bwrap.scrollHeight + 'px' : '0';
    });
    prov.appendChild(head); prov.appendChild(bwrap);
    body.appendChild(prov);
    if (focusRef && s.ref === focusRef) setTimeout(() => { head.click(); prov.scrollIntoView({behavior:'smooth', block:'center'}); }, 250);
  });
  openOverlay('notice-overlay');
}
$('nm-ask').addEventListener('click', () => {
  closeOverlays();
  ST.advisorFilter = String(ST.modalNotice);
  renderAdvisorPills(); switchTab('advisor');
});
$('nm-check').addEventListener('click', () => { closeOverlays(); openQuickCheck(ST.modalNotice); });

/* quick-check wizard */
function openQuickCheck(id) {
  const n = NOTICES[id], qc = QUICKCHECK[id]; if (!n || !qc) return;
  $('qc-name').textContent = `Notice ${id} — ${n.title}`;
  let step = 1;
  const render = nodeKey => {
    const body = $('qc-body'); body.innerHTML = '';
    const node = qc.nodes[nodeKey];
    body.appendChild(mkEl('div','qc-step',`QUESTION ${step}`));
    body.appendChild(mkEl('div','qc-q', esc(node.q)));
    const opts = mkEl('div','qc-opts');
    [['Yes','yes'],['No','no']].forEach(([lbl,key]) => {
      const b = mkEl('button','btn'+(key==='yes'?' primary':''), lbl);
      b.addEventListener('click', () => {
        const next = node[key];
        if (typeof next === 'string') { step++; render(next); }
        else showResult(next);
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
  };
  const showResult = res => {
    const body = $('qc-body'); body.innerHTML = '';
    const icon = res.type==='ok' ? 'ti-circle-check' : res.type==='warn' ? 'ti-alert-triangle' : 'ti-info-circle';
    body.appendChild(mkEl('div',`qc-result ${res.type}`,`<strong><i class="ti ${icon}" style="vertical-align:-2px"></i> ${esc(res.t)}</strong>${esc(res.d)}`));
    const row = mkEl('div','qc-restart qc-opts');
    const again = mkEl('button','btn','<i class="ti ti-rotate"></i> Start over');
    again.addEventListener('click', () => { step=1; render(qc.start); });
    const ask = mkEl('button','btn primary','<i class="ti ti-message-dots"></i> Ask the Advisor');
    ask.addEventListener('click', () => { closeOverlays(); ST.advisorFilter = String(id); renderAdvisorPills(); switchTab('advisor'); });
    row.appendChild(again); row.appendChild(ask);
    body.appendChild(row);
  };
  render(qc.start);
  openOverlay('qc-overlay');
}

/* ━━━ OVERLAYS & TERM POPOVER ━━━ */
function openOverlay(id) { $(id).classList.add('open'); }
function closeOverlays() { document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open')); }
document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) closeOverlays(); }));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeOverlays));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeOverlays(); hideTermPop(); } });

function hideTermPop() { $('term-pop').classList.add('hidden'); }
document.addEventListener('click', e => {
  const t = e.target.closest('.term');
  const pop = $('term-pop');
  if (!t) { if (!e.target.closest('.term-pop')) hideTermPop(); return; }
  const term = t.dataset.term;
  const def = GLOSSARY[term] || GLOSSARY[Object.keys(GLOSSARY).find(k=>k.toLowerCase()===term.toLowerCase())];
  if (!def) return;
  $('tp-name').textContent = term;
  $('tp-def').textContent = def;
  pop.classList.remove('hidden');
  const r = t.getBoundingClientRect(), pw = Math.min(320, window.innerWidth-24);
  pop.style.maxWidth = pw+'px';
  let x = Math.min(Math.max(12, r.left), window.innerWidth - pw - 12);
  let y = r.bottom + 8;
  if (y + pop.offsetHeight > window.innerHeight - 12) y = r.top - pop.offsetHeight - 8;
  pop.style.left = x+'px'; pop.style.top = Math.max(12,y)+'px';
});

/* ━━━ SMART TOOLS — shared ━━━ */
function switchTool(tool) {
  ST.toolTab = tool;
  document.querySelectorAll('.tool-tab').forEach(b => b.classList.toggle('active', b.dataset.tool === tool));
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.toggle('active', p.id === 'tool-'+tool));
}
document.querySelectorAll('.tool-tab').forEach(b => b.addEventListener('click', () => switchTool(b.dataset.tool)));

const CCY_RE = /\b(MYR|RM|USD|EUR|GBP|SGD|JPY|CNY|AUD|HKD|THB|IDR|US\$|S\$|€|£|¥)\s?([\d][\d,]*(?:\.\d{1,2})?)(\s?(?:million|billion|mil|bn|k))?\b/gi;
function detectEntities(text) {
  const amounts = []; let m;
  CCY_RE.lastIndex = 0;
  while ((m = CCY_RE.exec(text)) && amounts.length < 12) amounts.push(m[0].trim());
  const lower = text.toLowerCase();
  const noticeHits = Object.values(NOTICES).map(n => {
    const hits = n.kw.filter(k => lower.includes(k.toLowerCase()));
    return { n, hits };
  }).filter(x => x.hits.length >= 2).sort((a,b)=>b.hits.length-a.hits.length).slice(0,3);
  return { amounts:[...new Set(amounts)], noticeHits };
}
function entityBlock(ents, container) {
  container.innerHTML = '';
  if (!ents.amounts.length && !ents.noticeHits.length) {
    container.appendChild(mkEl('div','sec-hdr','No FX entities detected'));
    return;
  }
  if (ents.amounts.length) {
    container.appendChild(mkEl('div','sec-hdr','Detected currencies & amounts'));
    const row = mkEl('div','entity-row');
    ents.amounts.forEach(a => row.appendChild(mkEl('span','entity-chip amt',`<i class="ti ti-coin"></i>${esc(a)}`)));
    container.appendChild(row);
  }
  if (ents.noticeHits.length) {
    container.appendChild(mkEl('div','sec-hdr','Potential FEP touchpoints'));
    const row = mkEl('div','entity-row');
    ents.noticeHits.forEach(({n,hits}) => {
      const chip = mkEl('button','entity-chip note',`<i class="ti ti-book-2"></i>${n.short} · ${esc(n.title.split(',')[0])} (${hits.length} signals)`);
      chip.title = 'Matched: ' + hits.slice(0,6).join(', ');
      chip.addEventListener('click', () => openNotice(n.id));
      row.appendChild(chip);
    });
    container.appendChild(row);
  }
}
function highlightCcy(text) {
  return esc(text).replace(CCY_RE, m => `<mark class="ccy">${m}</mark>`);
}
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('Failed to load '+src));
    document.head.appendChild(s);
  });
}
function wireDropzone(zoneId, inputId, onFile) {
  const zone = $(zoneId), input = $(inputId);
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => input.files[0] && onFile(input.files[0]));
  ['dragover','dragenter'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag'); }));
  ['dragleave','drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag'); }));
  zone.addEventListener('drop', e => e.dataTransfer.files[0] && onFile(e.dataTransfer.files[0]));
}
function sendToAnalyst(source, text, ents) {
  const summary = `${source}: ${ents.amounts.length ? 'amounts '+ents.amounts.slice(0,5).join(', ') : 'no amounts detected'}`
    + (ents.noticeHits.length ? ' · touches ' + ents.noticeHits.map(x=>x.n.short).join(', ') : '');
  ST.analystImport = { source, summary, excerpt: text.slice(0, 900) };
  switchTab('tools'); switchTool('analyst'); renderImportChip();
  toast('Document context attached to AI Analyst');
}
function renderImportChip() {
  const chip = $('analyst-import');
  if (!ST.analystImport) { chip.classList.add('hidden'); return; }
  chip.classList.remove('hidden');
  chip.innerHTML = `<i class="ti ti-paperclip"></i><span><strong>${esc(ST.analystImport.source)}</strong> attached — ${esc(ST.analystImport.summary)}</span><button title="Remove"><i class="ti ti-x"></i></button>`;
  chip.querySelector('button').addEventListener('click', () => { ST.analystImport = null; renderImportChip(); });
}

/* ━━━ TOOL 1 — OCR scanner ━━━ */
let scanState = { file:null, text:'' };
wireDropzone('scan-drop','scan-file', f => {
  if (!f.type.startsWith('image/')) return toast('Please choose an image file');
  scanState = { file:f, text:'' };
  $('scan-preview').src = URL.createObjectURL(f);
  $('scan-drop').classList.add('hidden');
  $('scan-stage').classList.remove('hidden');
  $('scan-text').textContent = '—';
  $('scan-entities').innerHTML = '';
  $('scan-send').classList.add('hidden');
});
$('scan-reset').addEventListener('click', () => {
  $('scan-stage').classList.add('hidden'); $('scan-drop').classList.remove('hidden'); $('scan-file').value = '';
});
$('scan-run').addEventListener('click', async () => {
  if (!scanState.file) return;
  const btn = $('scan-run'), prog = $('scan-progress'), bar = $('scan-bar'), pct = $('scan-pct');
  btn.disabled = true; prog.classList.remove('hidden'); bar.style.width = '4%'; pct.textContent = 'loading OCR engine…';
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: m => { if (m.status === 'recognizing text') { const p = Math.round(m.progress*100); bar.style.width = p+'%'; pct.textContent = p+'%'; } }
    });
    const { data } = await worker.recognize(scanState.file);
    await worker.terminate();
    scanState.text = data.text || '';
    $('scan-text').innerHTML = scanState.text.trim() ? highlightCcy(scanState.text) : '(no text recognised)';
    const ents = detectEntities(scanState.text);
    entityBlock(ents, $('scan-entities'));
    $('scan-send').classList.remove('hidden');
    $('scan-send').onclick = () => sendToAnalyst('Scanned image', scanState.text, ents);
  } catch (err) {
    $('scan-text').textContent = 'OCR failed: ' + err.message + ' (check your internet connection — the OCR engine loads from CDN).';
  } finally {
    btn.disabled = false; prog.classList.add('hidden');
  }
});

/* ━━━ TOOL 2 — PDF reader & validator ━━━ */
wireDropzone('pdf-drop','pdf-file', async f => {
  if (f.type !== 'application/pdf') return toast('Please choose a PDF file');
  $('pdf-drop').classList.add('hidden'); $('pdf-stage').classList.remove('hidden');
  $('pdf-meta').innerHTML = `<strong>${esc(f.name)}</strong><br>Reading…`;
  $('pdf-text').textContent = '—'; $('pdf-entities').innerHTML = ''; $('pdf-flags').innerHTML = '';
  $('pdf-send').classList.add('hidden');
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    const pdf = await window.pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
    const maxPages = Math.min(pdf.numPages, 10);
    let text = '';
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      text += tc.items.map(it => it.str).join(' ') + '\n\n';
    }
    $('pdf-meta').innerHTML = `<strong>${esc(f.name)}</strong><br>${pdf.numPages} page${pdf.numPages!==1?'s':''} · ${(f.size/1024).toFixed(0)} KB<br>Parsed first ${maxPages} page${maxPages!==1?'s':''}`;
    $('pdf-text').innerHTML = text.trim() ? highlightCcy(text.slice(0, 6000)) : '(no extractable text — the PDF may be scanned; try the Image Reader with a screenshot)';
    const ents = detectEntities(text);
    entityBlock(ents, $('pdf-entities'));
    const flags = $('pdf-flags');
    if (ents.noticeHits.length) {
      flags.appendChild(mkEl('div','sec-hdr','Validator flags'));
      ents.noticeHits.forEach(({n,hits}) => flags.appendChild(mkEl('div','flag-item',
        `<i class="ti ti-flag-3"></i><span>This document references <strong>${hits.slice(0,4).map(esc).join(', ')}</strong> — review against <strong>Notice ${n.id} (${esc(n.title)})</strong> before processing.</span>`)));
    }
    $('pdf-send').classList.remove('hidden');
    $('pdf-send').onclick = () => sendToAnalyst('PDF “'+f.name+'”', text, ents);
  } catch (err) {
    $('pdf-meta').innerHTML = `<strong>${esc(f.name)}</strong><br><span style="color:var(--red)">Failed: ${esc(err.message)}</span>`;
  }
});
$('pdf-reset').addEventListener('click', () => {
  $('pdf-stage').classList.add('hidden'); $('pdf-drop').classList.remove('hidden'); $('pdf-file').value = '';
});

/* ━━━ TOOL 3 — AI compliance analyst ━━━ */
$('analyst-form').addEventListener('submit', async e => {
  e.preventDefault();
  const who = $('af-who').value, what = $('af-what').value;
  const where = $('af-where').value.trim(), why = $('af-why').value.trim();
  const ccy = $('af-ccy').value, amt = $('af-amt').value, ctx = $('af-ctx').value.trim();
  if (!who || !what) return toast('Please select who is transacting and the transaction type');

  const parts = [`WHO: ${who}`, `WHAT: ${what}`];
  if (where) parts.push(`WHERE: ${where}`);
  if (why) parts.push(`WHY: ${why}`);
  if (amt) parts.push(`AMOUNT: ${ccy} ${Number(amt).toLocaleString()}`);
  if (ctx) parts.push(`CONTEXT: ${ctx}`);
  if (ST.analystImport) parts.push(`DOCUMENT EXTRACT (${ST.analystImport.source}): ${ST.analystImport.excerpt}`);
  const query = parts.join('\n');

  const out = $('analyst-out'); out.innerHTML = '';
  out.appendChild(mkEl('div','sec-hdr','Compliance health-check'));
  const chunks = retrieve(`${who} ${what} ${why} ${ctx}`, 'all', 6);

  if (!aiConfigured()) {
    out.appendChild(mkEl('div','error-msg','No AI provider configured — showing a reference lookup instead. Add a Gemini key or enable Ollama in Settings for full AI verdicts.'));
    out.appendChild(provisionList(chunks));
    return;
  }
  const load = mkEl('div','loading','<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
  out.appendChild(load);
  $('analyst-run').disabled = true;
  try {
    const raw = await callAI(query, chunks, []);
    load.remove();
    const p = parseResp(raw);
    if (p.ok) out.appendChild(verdictCard(p.data, chunks, p.partial));
    else out.appendChild(rawCard(p.raw));
    out.appendChild(provisionList(chunks, 'Provisions used for this check'));
  } catch (err) {
    load.remove();
    out.appendChild(mkEl('div','error-msg', esc(err.message)));
    out.appendChild(provisionList(chunks));
  } finally {
    $('analyst-run').disabled = false;
    out.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
});

/* ━━━ ADVISOR CHAT ━━━ */
function renderAdvisorPills() {
  const bar = $('advisor-pills'); bar.innerHTML = '';
  [{id:'all',label:'All Notices'}, ...Object.values(NOTICES).map(n=>({id:String(n.id),label:n.short+' · '+n.title.split(',')[0].split(' and ')[0]}))].forEach(p => {
    const b = mkEl('button','npill'+(ST.advisorFilter===p.id?' on':''), esc(p.label));
    b.addEventListener('click', () => { ST.advisorFilter = p.id; renderAdvisorPills(); });
    bar.appendChild(b);
  });
  $('advisor-scope').textContent = 'Scope: ' + (ST.advisorFilter==='all' ? 'All Notices' : 'Notice '+ST.advisorFilter);
}
const SAMPLES = [
  'Can a resident individual with a housing loan invest RM1.5 million in Singapore stocks?',
  'My customer wants to carry RM5,000 cash to Bangkok — allowed?',
  'A Malaysian company is borrowing USD 30 million from its parent in Japan. Any limits?',
  'Exporter received only 80% of proceeds after freight deductions — compliant with Notice 7?',
];
function renderAdvisorEmpty() {
  const m = $('msgs'); m.innerHTML = '';
  const empty = mkEl('div','empty-center',
    `<i class="ti ti-message-chatbot"></i><h3>Ask the FEP Advisor</h3>
     <p>Describe the transaction — <strong>who</strong> is transacting, <strong>what</strong> they're doing, <strong>where</strong>, <strong>why</strong> and the <strong>amount</strong>. You'll get a structured verdict with BNM citations.</p>`);
  const s = mkEl('div','samples');
  SAMPLES.forEach(q => {
    const b = mkEl('button','sample', esc(q));
    b.addEventListener('click', () => { $('chat-inp').value = q; $('send-btn').disabled = false; sendChat(); });
    s.appendChild(b);
  });
  empty.appendChild(s);
  m.appendChild(empty);
}
function pushUserMsg(text) { $('msgs').appendChild(mkEl('div','msg-user', esc(text))); }
async function sendChat() {
  const inp = $('chat-inp');
  const q = inp.value.trim();
  if (!q || ST.loading) return;
  if (!aiConfigured()) { toast('Configure an AI provider in Settings first'); switchTab('settings'); return; }
  if (!ST.msgs.length) $('msgs').innerHTML = '';
  inp.value = ''; $('send-btn').disabled = true;
  pushUserMsg(q);
  ST.msgs.push({ role:'user', content:q });
  const m = $('msgs');
  const load = mkEl('div','loading','<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
  m.appendChild(load); m.scrollTop = m.scrollHeight;
  ST.loading = true;
  try {
    const chunks = retrieve(q, ST.advisorFilter, 5);
    const raw = await callAI(q, chunks, ST.msgs.slice(0,-1));
    load.remove();
    const wrap = mkEl('div','msg-ai');
    const p = parseResp(raw);
    if (p.ok) { wrap.appendChild(verdictCard(p.data, chunks, p.partial)); ST.msgs.push({ role:'assistant', content: JSON.stringify(p.data) }); }
    else { wrap.appendChild(rawCard(p.raw)); ST.msgs.push({ role:'assistant', content: raw }); }
    m.appendChild(wrap);
    // persist session
    const sess = ST.sessions.find(s => s.id === ST.sessId);
    if (sess) { sess.msgs = ST.msgs; sess.q = ST.msgs[0].content; }
    else ST.sessions.unshift({ id: ST.sessId, q, ts: Date.now(), msgs: ST.msgs });
    ST.sessions = ST.sessions.slice(0, 30);
    save('fep_sess', ST.sessions);
  } catch (err) {
    load.remove();
    m.appendChild(mkEl('div','error-msg', esc(err.message)));
  } finally {
    ST.loading = false;
    m.scrollTop = m.scrollHeight;
  }
}
ST.sessId = Date.now().toString();
$('chat-inp').addEventListener('input', e => { $('send-btn').disabled = !e.target.value.trim(); });
$('chat-inp').addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
$('send-btn').addEventListener('click', sendChat);
$('new-chat-btn').addEventListener('click', () => { ST.msgs = []; ST.sessId = Date.now().toString(); renderAdvisorEmpty(); });
$('history-btn').addEventListener('click', () => {
  const body = $('hist-body'); body.innerHTML = '';
  if (!ST.sessions.length) body.appendChild(mkEl('div','empty-center','<i class="ti ti-history"></i><p>No saved conversations yet.</p>'));
  ST.sessions.forEach(s => {
    const card = mkEl('div','sess-card',`<div class="sess-q">${esc(s.q)}</div><div class="sess-ts">${new Date(s.ts).toLocaleString('en-MY')}</div>`);
    card.addEventListener('click', () => {
      closeOverlays();
      ST.msgs = s.msgs.slice(); ST.sessId = s.id;
      const m = $('msgs'); m.innerHTML = '';
      ST.msgs.forEach(msg => {
        if (msg.role === 'user') pushUserMsg(msg.content);
        else {
          const wrap = mkEl('div','msg-ai');
          const p = parseResp(msg.content);
          if (p.ok) wrap.appendChild(verdictCard(p.data, null, p.partial)); else wrap.appendChild(rawCard(msg.content));
          m.appendChild(wrap);
        }
      });
      switchTab('advisor');
    });
    body.appendChild(card);
  });
  if (ST.sessions.length) {
    const clr = mkEl('button','clr-btn','<i class="ti ti-trash"></i> Clear all history');
    clr.addEventListener('click', () => { ST.sessions = []; save('fep_sess', []); closeOverlays(); toast('History cleared'); });
    body.appendChild(clr);
  }
  openOverlay('hist-overlay');
});

/* ━━━ SETTINGS ━━━ */
const GEMINI_MODELS = [
  { id:'gemini-2.5-flash', note:'fast · recommended' },
  { id:'gemini-2.5-pro', note:'strongest reasoning' },
  { id:'gemini-2.0-flash', note:'legacy fallback' },
];
function renderSettings() {
  const el = $('settings-content'); el.innerHTML = '';
  const c = ST.cfg;
  const sec = mkEl('div','card');
  sec.innerHTML = `<div class="card-head"><h2><i class="ti ti-plug-connected"></i> AI Provider</h2></div>
  <div class="provider-opts">
    <button class="popt ${c.provider==='gemini'?'on':''}" data-p="gemini"><span class="popt-id">Gemini</span><span class="popt-note">Cloud · free API key from Google AI Studio</span></button>
    <button class="popt ${c.provider==='ollama'?'on':''}" data-p="ollama"><span class="popt-id">Ollama</span><span class="popt-note">Local · fully offline, no API key</span></button>
  </div>
  <div id="prov-fields"></div>
  <div class="btn-row">
    <button class="btn primary" id="set-save"><i class="ti ti-device-floppy"></i> Save</button>
    <button class="btn" id="set-test"><i class="ti ti-wifi"></i> Test Connection</button>
    <span id="set-status" class="status-info"></span>
  </div>
  <div class="info-box">
    <strong>Gemini:</strong> create a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">aistudio.google.com/app/apikey</a>, paste it above and Save.<br>
    <strong>Ollama:</strong> install from <a href="https://ollama.com" target="_blank" rel="noopener">ollama.com</a>, run <code>ollama pull qwen2.5:7b</code>, then select Ollama. Keys are stored only in this browser (localStorage).
  </div>`;
  el.appendChild(sec);

  const data = mkEl('div','card'); data.style.marginTop = '16px';
  data.innerHTML = `<div class="card-head"><h2><i class="ti ti-database"></i> Data &amp; About</h2></div>
    <p class="hint" style="margin-bottom:12px">FEP Compass v2.0 · Notices N1–N7 effective 1 Oct 2025 · Educational guidance only, not legal advice.
    Official source: <a href="${BNM_NOTICES_URL}" target="_blank" rel="noopener">bnm.gov.my/fep/policies/notices</a></p>
    <div class="btn-row" style="margin-top:0">
      <button class="btn" id="reset-limits"><i class="ti ti-rotate"></i> Reset limit trackers</button>
      <button class="btn" id="clear-data" style="color:var(--red);border-color:var(--red-bdr)"><i class="ti ti-trash"></i> Clear all local data</button>
    </div>`;
  el.appendChild(data);

  const fields = sec.querySelector('#prov-fields');
  const renderFields = () => {
    if (c.provider === 'gemini') {
      fields.innerHTML = `
        <div class="set-field"><label class="set-lbl">Gemini API Key</label>
          <input class="set-inp" id="f-key" type="password" placeholder="AIzaSy…" value="${esc(c.apiKey)}"></div>
        <div class="set-field"><label class="set-lbl">Model</label><div class="model-opts">${
          GEMINI_MODELS.map(mo=>`<button class="mopt ${c.model===mo.id?'on':''}" data-m="${mo.id}"><span class="mopt-id">${mo.id}</span><span class="mopt-note">${mo.note}</span></button>`).join('')
        }</div></div>`;
      fields.querySelectorAll('.mopt').forEach(b => b.addEventListener('click', () => { c.model = b.dataset.m; renderFields(); }));
      fields.querySelector('#f-key').addEventListener('input', e => c.apiKey = e.target.value.trim());
    } else {
      fields.innerHTML = `
        <div class="set-field"><label class="set-lbl">Ollama URL</label>
          <input class="set-inp" id="f-url" value="${esc(c.ollamaUrl)}"></div>
        <div class="set-field"><label class="set-lbl">Model</label>
          <input class="set-inp" id="f-model" value="${esc(c.ollamaModel)}">
          <div class="hint">Pull first: <code>ollama pull qwen2.5:7b</code></div></div>`;
      fields.querySelector('#f-url').addEventListener('input', e => c.ollamaUrl = e.target.value.trim());
      fields.querySelector('#f-model').addEventListener('input', e => c.ollamaModel = e.target.value.trim());
    }
  };
  renderFields();
  sec.querySelectorAll('.popt').forEach(b => b.addEventListener('click', () => {
    c.provider = b.dataset.p;
    sec.querySelectorAll('.popt').forEach(x => x.classList.toggle('on', x.dataset.p === c.provider));
    renderFields();
  }));
  sec.querySelector('#set-save').addEventListener('click', () => { save('fep_cfg', c); toast('Settings saved'); });
  sec.querySelector('#set-test').addEventListener('click', async () => {
    const st = sec.querySelector('#set-status');
    st.className = 'status-info'; st.textContent = 'Testing…';
    try {
      const raw = await callAI('Reply with exactly: {"verdict":"PERMITTED","summary":"connection ok","explanation":"test","citation":"","conditions":[],"warning":null,"nextStep":"No filing required"}', CHUNKS.slice(0,1), []);
      st.className = raw ? 'status-ok' : 'status-err';
      st.textContent = raw ? '✓ Connected' : 'Empty response';
    } catch (err) { st.className = 'status-err'; st.textContent = err.message; }
  });
  data.querySelector('#reset-limits').addEventListener('click', () => {
    ST.limits = JSON.parse(JSON.stringify(DEFAULT_LIMITS)); save('fep_limits', ST.limits); renderRings(); toast('Limit trackers reset');
  });
  const clearBtn = data.querySelector('#clear-data');
  clearBtn.addEventListener('click', () => {
    if (!clearBtn.dataset.armed) {
      clearBtn.dataset.armed = '1';
      clearBtn.innerHTML = '<i class="ti ti-alert-triangle"></i> Tap again to erase everything';
      setTimeout(() => { delete clearBtn.dataset.armed; clearBtn.innerHTML = '<i class="ti ti-trash"></i> Clear all local data'; }, 3500);
      return;
    }
    ['fep_cfg','fep_sess','fep_limits','fep_decls'].forEach(k => localStorage.removeItem(k));
    location.reload();
  });
}

/* ━━━ PWA — offline service worker (https / localhost only) ━━━ */
if ('serviceWorker' in navigator &&
    (location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('sw.js').catch(() => {/* file:// or unsupported — app still works online */});
}

/* ━━━ INIT ━━━ */
renderDashboard();
renderDashNotices();
renderNoticeCards();
renderGlossary();
renderAdvisorPills();
renderAdvisorEmpty();
renderSettings();
buildBM25();
