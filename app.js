/* ════════════════════════════════════════════════════════════════════
   FEP COMPASS v2.0 — application logic
   Knowledge base · BM25 RAG · OCR / PDF readers · AI compliance analyst
   ════════════════════════════════════════════════════════════════════ */
'use strict';

/* ━━━ KNOWLEDGE BASE — MALAYSIA FEP NOTICES 1–7 (effective 1 Oct 2025) ━━━ */

const FEP_OFFICIAL_URL = 'https://www.bnm.gov.my/fep/policies/notices';

const NOTICES = {
  1: { id:1, short:'N1', icon:'ti-coin', title:'Dealings in Currency, Gold and Other Precious Metals',
    desc:'Who may buy or sell foreign currency, on spot or forward basis, hedging frameworks and dealings with money changers.',
    secs: [
      {ref:'Part A, Para 1(1)',title:'Resident — buying/selling FCY vs Ringgit',body:'A Resident is allowed to buy or sell Foreign Currency against Ringgit for its own account on Spot Basis with a LOB, or on Forward Basis with a LOB on Firm Commitment or Anticipatory basis. The Forward Basis transaction shall be terminated when the Firm Commitment ceases to exist or the anticipated transaction does not materialise.'},
      {ref:'Part A, Para 5',title:'Resident — buying/selling FCY vs another FCY',body:'A Resident is allowed to buy or sell Foreign Currency against another Foreign Currency on Spot Basis or Forward Basis with a LOB.'},
      {ref:'Part A, Para 3',title:'Resident Entity — transacting on behalf of Group entities',body:'A Resident Entity is allowed to buy or sell Foreign Currency against Ringgit on behalf of an Entity within its Group with a LOB, provided the Principal is not a Financial Institution or NRFI, and the Principal complies with applicable paragraphs based on Resident or Non-Resident status.'},
      {ref:'Part A, Para 2',title:'Resident Institutional Investor — Dynamic Hedging Framework',body:'A Resident Institutional Investor registered with the FEP Authority under the Dynamic Hedging Framework is allowed to enter into plain vanilla forward contracts to sell FCY against Ringgit up to 100% of its FCY-denominated securities and temporary FCY deposits, without documentary evidence. One-off registration required via the FEP Authority\'s portal at https://bnm.my/fep.'},
      {ref:'Part B, Para 6(1)',title:'Non-Resident — buying/selling FCY vs Ringgit',body:'A Non-Resident is allowed to buy or sell Foreign Currency against Ringgit on Spot Basis with a LOB or AOO; or on Forward Basis with a LOB or AOO for Current Account Transactions (Firm Commitment or Anticipatory basis) or Financial Account Transactions (Firm Commitment basis only). Forward terminates when Firm Commitment ceases or anticipated transaction does not materialise.'},
      {ref:'Part B, Para 12',title:'Non-Resident — Forward Basis restrictions and exclusions',body:'For Non-Residents, Forward Basis EXCLUDES: (i) settlement of Ringgit negotiable instrument of deposits; (ii) transactions involving an External Account (except Ringgit deposits up to 3 months from Ringgit Asset sale prior to forward maturity); or (iii) settlement of OTC derivatives tantamount to Ringgit borrowing/lending between Resident and Non-Resident.'},
      {ref:'Part B, Para 13',title:'Non-Resident — buying/selling FCY vs another FCY',body:'A Non-Resident is allowed to buy or sell Foreign Currency against another Foreign Currency on Spot Basis or Forward Basis with a LOB.'},
      {ref:'Part B, Para 7',title:'Non-Resident Institutional Investor — Dynamic Hedging',body:'A Non-Resident Institutional Investor registered with the FEP Authority may buy FCY against Ringgit up to 100% or sell FCY against Ringgit up to 25% of its Ringgit-denominated asset exposure (Ringgit securities on RENTAS/Bursa Malaysia). Registration required via https://bnm.my/fep.'},
      {ref:'Part C, Para 14',title:'Licensed Money Changer — dealings',body:'A Resident or Non-Resident is allowed to buy or sell Foreign Currency against Ringgit or against another Foreign Currency on Spot Basis with a Licensed Money Changer.'},
      {ref:'Part D, Para 16',title:'Gold and Precious Metals',body:'A person is allowed to buy, sell, exchange, borrow, lend, retain or use gold or other precious metals (subject to FSA/IFSA). Export of gold or other precious metals is subject to compliance with Notice 7.'},
    ],
    kw:['buy','sell','dealing','forward','spot','hedging','LOB','AOO','money changer','institutional investor','FCY','ringgit','gold','precious metals','anticipatory','firm commitment','unwind','cancel','speculate','dynamic hedging','hedge','forward contract','currency exchange'],
    faqs: [
      {ref:'FAQ Q1',title:'Is there a tenure limit for a Resident to hedge FC obligations?',body:'No. A Resident may freely hedge up to the underlying tenure of its Foreign Currency (FC) obligations.'},
      {ref:'FAQ Q2',title:'Can a Resident hedge export receipts up to the underlying tenure and amount?',body:'Yes, a Resident may freely buy ringgit against FC to hedge incoming funds, including Export Proceeds, up to the underlying tenure and amount.'},
      {ref:'FAQ Q3',title:'If a Resident\'s Borrowing repayment is due in 24 months, can it hedge for 12 months and roll over the forward contract later?',body:'Yes.'},
      {ref:'FAQ Q4',title:'Can a Resident hedge its investment in FC assets?',body:'Yes, provided the investment complies with the permissible limit set out in Notice 3.'},
      {ref:'FAQ Q5',title:'Can a forward contract entered on an Anticipatory basis for investment in FC assets be maintained if the projected investment does not materialise?',body:'No. The company must cancel the forward contract if the projected investment fails to materialise.'},
      {ref:'FAQ Q6',title:'Can a Resident entity with multi-national operations undertake balance sheet hedging for FX translation risk?',body:'Yes. The FX hedging amount must be limited to the net assets or liabilities exposed to FX risk.'},
      {ref:'FAQ Q7',title:'Can a Resident individual buy or sell FC directly with a Non-Resident?',body:'No. A Resident may only buy or sell FC with licensed onshore banks and licensed money changers.'},
      {ref:'FAQ Q8',title:'Must a Resident cancel an over-hedged forward position?',body:'Yes.'},
      {ref:'FAQ Q9',title:'Can a Resident use a domestic FC-denominated contract (e.g. an invoice) as the underlying for hedging?',body:'No. A Resident is not allowed to hedge a foreign-currency-denominated contract that is issued to, or received from, another Resident.'},
      {ref:'FAQ Q10',title:'Can a financial institution undertake hedging on behalf of its related entities within the same Group?',body:'No, a financial institution is not eligible for this flexibility.'},
      {ref:'FAQ Q11',title:'What types of underlying FX exposures can be managed on behalf of entities within the same Group?',body:'Any FX exposure arising from permitted underlying commitments belonging to the entities within the same Group.'},
      {ref:'FAQ Q12',title:'Are associate companies considered part of the entities within the same Group?',body:'Yes, a Resident entity may undertake FX transactions on behalf of entities within the same Group, including its associate company.'},
      {ref:'FAQ Q13',title:'Can a Resident company undertaking FX transactions on behalf of Group entities also make or receive payments on their behalf?',body:'Yes.'},
      {ref:'FAQ Q14',title:'Can a Resident freely cancel or unwind a forward contract if the underlying commitment (e.g. FC Borrowing) has not been fully repaid?',body:'Yes. There is no restriction on cancelling or unwinding a forward contract involving ringgit where the underlying commitment still exists.'},
      {ref:'FAQ Q15',title:'Is there a limit or threshold on the forward contracts a Resident can cancel or unwind?',body:'No, but a Resident must not use this flexibility to speculate on the ringgit.'},
      {ref:'FAQ Q16',title:'Can a Resident unwind an existing forward contract by entering into a new forward contract without an underlying?',body:'Yes, provided the licensed onshore bank is satisfied that the new forward contract is entered to cancel an existing forward contract that has an underlying.'},
      {ref:'FAQ Q17',title:'Can a Resident unwind its forward position with a different licensed onshore bank?',body:'Yes, provided the licensed onshore bank is satisfied that the forward contract is entered to cancel an existing forward contract with an underlying commitment.'},
      {ref:'FAQ Q18',title:'Can a Resident Institutional Investor cancel or unwind forward contracts hedging FX risk from portfolio investment?',body:'Yes, a Resident Institutional Investor may do so once it has registered with BNM under the Dynamic Hedging Framework.'},
      {ref:'FAQ Q19',title:'Who is eligible to register for the Dynamic Hedging Framework?',body:'Any Resident Institutional Investor may register with BNM at firm level.'},
      {ref:'FAQ Q20',title:'Can a Resident Institutional Investor registered at firm level carve out specific funds for passive hedging?',body:'Yes. During registration, the Resident Institutional Investor must make a one-off declaration of the funds to be used for dynamic hedging. Funds carved out for passive hedging are not eligible for dynamic hedging.'},
      {ref:'FAQ Q21',title:'What hedging instruments are permitted under the Dynamic Hedging Framework?',body:'Only plain vanilla FX/MYR forward contracts (buying or selling) are permitted as the hedging instrument.'},
      {ref:'FAQ Q22',title:'What underlying assets are eligible for dynamic hedging by a Resident Institutional Investor?',body:'(a) Investment in FC-denominated debt securities; (b) investment in FC-denominated equity securities; or (c) temporary placement in FC deposits or deposit-like securities, using FC proceeds from selling the FC-denominated securities in (a) or (b), for up to 3 months pending reinvestment of those FC proceeds.'},
      {ref:'FAQ Q23',title:'What is the permitted threshold for dynamic hedging by a Resident Institutional Investor?',body:'A Resident Institutional Investor registered with BNM may freely enter into forward contracts to buy ringgit against FC up to 100% of its invested underlying FC-denominated assets.'},
      {ref:'FAQ Q24',title:'What happens if a Resident Institutional Investor breaches the permitted dynamic hedging threshold?',body:'The Resident Institutional Investor must unwind the forward position back to the permitted limit. BNM will advise the permitted timeline for unwinding on a case-by-case basis (within 7 business days); failure to comply may result in BNM reviewing the investor\'s eligibility.'},
      {ref:'FAQ Q25',title:'Can a Resident Institutional Investor use its existing Legal Entity Identifier (LEI) to register for dynamic hedging?',body:'Yes, a Resident Institutional Investor should use its existing LEI to register. BNM will issue an ID to a Resident Institutional Investor that does not have an LEI. More information on the LEI is available at https://www.leiroc.org/.'},
      {ref:'FAQ Q26',title:'What FX hedging is permitted for commodity derivative contracts offered by a Resident provider?',body:'Where a Resident has FX exposure from contracting FC-denominated commodity derivatives, it may hedge up to the net open position (NOP) of the FC exposure arising from those derivative contracts. This covers any derivative (other than exchange rate derivatives) denominated in FC that is traded on Bursa Malaysia (e.g. USD Crude Palm Oil Futures) or offered over-the-counter (OTC) by approved Resident providers.'},
      {ref:'FAQ Q27',title:'Must a Resident observe the NOP requirement for commodity derivative hedging on an intra-day basis?',body:'No, the NOP requirement applies at the end of the business day, consistent with international standards. If the FX market has already closed, any over-hedge position must be unwound at the earliest possible time.'},
      {ref:'FAQ Q28',title:'Is documentation required upfront if a commodity derivative service provider or broker cannot promptly provide a statement of derivative contract positions?',body:'No, documentation may be produced after the transaction, subject to the licensed onshore bank\'s KYC procedures.'},
      {ref:'FAQ Q29',title:'Is the NOP for commodity derivative hedging computed on an aggregate basis across all underlying derivative contracts with a Resident?',body:'No, the NOP is computed separately based on the respective types of derivative contracts.'},
      {ref:'FAQ Q30',title:'Who can a Non-Resident buy or sell ringgit against FC with to hedge its ringgit exposure?',body:'A Non-Resident may buy or sell ringgit against FC with any licensed onshore bank or an appointed overseas office (AOO), on: (i) a Spot Basis; or (ii) a Forward Basis for Current Account Transactions on a Firm Commitment or Anticipatory basis, or Financial Account Transactions on a Firm Commitment basis. An AOO is an overseas outfit of a licensed onshore bank\'s banking group appointed by that bank to facilitate ringgit transactions.'},
      {ref:'FAQ Q31',title:'What proof of underlying is needed to support FX hedging on an Anticipatory basis via an AOO by a Non-Resident?',body:'The proof of underlying is determined by the respective AOO and licensed onshore bank\'s customer due diligence (CDD) process, which includes verifying the Non-Resident\'s projected transaction against its previous track record. Further detail is set out in the Minimum Due Diligence for FX Transactions issued by the banking industry.'},
      {ref:'FAQ Q32',title:'Can a Non-Resident unwind a forward contract entered on an Anticipatory basis if its value exceeds the Firm underlying amount?',body:'Yes. Alternatively, the Non-Resident may roll over the contract to cover its other underlying commitments.'},
      {ref:'FAQ Q33',title:'How should a trust bank or global custodian undertake FX trades involving ringgit on behalf of its clients?',body:'All FX trades involving ringgit on behalf of clients must be conducted on a gross basis with a licensed onshore bank or an AOO.'},
      {ref:'FAQ Q34',title:'Can a Non-Resident freely cancel or unwind a forward contract if the underlying ringgit Borrowing has not been fully repaid?',body:'Yes. There is no restriction on cancelling or unwinding a forward contract involving ringgit where the underlying commitment still exists, provided the underlying is not in the form of portfolio investment.'},
      {ref:'FAQ Q35',title:'Is there a limit or threshold on the forward contracts a Non-Resident can cancel or unwind?',body:'No, but a Non-Resident should use this flexibility to manage its FX risk prudently.'},
      {ref:'FAQ Q36',title:'Can a Non-Resident unwind an existing forward contract by entering into an opposite forward contract without an underlying?',body:'Yes, provided the licensed onshore bank or AOO is satisfied that the new forward contract is entered to cancel an existing forward contract with an underlying commitment.'},
      {ref:'FAQ Q37',title:'Can a Non-Resident unwind its forward position with a different licensed onshore bank or AOO?',body:'Yes, provided the licensed onshore bank or AOO is satisfied that the forward contract is entered to cancel an existing forward contract with an underlying.'},
      {ref:'FAQ Q38',title:'Can a Non-Resident Institutional Investor cancel or unwind forward contracts hedging FX risk from portfolio investment?',body:'Yes, once the Non-Resident Institutional Investor has registered with BNM under the Dynamic Hedging Framework.'},
      {ref:'FAQ Q39',title:'What FX hedging is permitted for commodity derivative contracts offered by a Resident provider to a Non-Resident?',body:'Where a Non-Resident has FX exposure from contracting ringgit-denominated commodity derivatives that involve physical settlement on maturity, it may hedge up to the net open position (NOP) of the FX exposure arising from those derivative contracts. This covers any derivative (other than exchange rate derivatives) denominated in ringgit that is traded on Bursa Malaysia (e.g. Crude Palm Oil Futures (FCPO) and Options on Crude Palm Oil Futures (OCPO)) or offered over-the-counter (OTC) by approved Resident providers.'},
      {ref:'FAQ Q40',title:'Must a Non-Resident observe the NOP requirement for commodity derivative hedging on an intra-day basis?',body:'No, the NOP requirement applies at the end of the business day, consistent with international standards. If the FX market has already closed, any over-hedged position must be unwound at the earliest possible time.'},
      {ref:'FAQ Q41',title:'Is documentation required upfront if a commodity derivative service provider or broker cannot promptly provide a statement of derivative contract positions?',body:'No, documentation may be produced after the transaction, subject to the licensed onshore bank\'s KYC procedures.'},
      {ref:'FAQ Q42',title:'Is the NOP for commodity derivative hedging computed on an aggregate basis across all underlying derivative contracts with a Resident?',body:'No, the NOP is computed separately based on the respective types of derivative contracts.'},
      {ref:'FAQ Q43',title:'Can a Non-Resident entity undertake FX transactions on behalf of its Resident and Non-Resident entities within the same Group?',body:'Yes, a Non-Resident entity may undertake FX transactions for FX exposures with a licensed onshore bank or an AOO on behalf of its Resident or Non-Resident entities within the same Group.'},
      {ref:'FAQ Q44',title:'What types of underlying FX exposures can a Non-Resident entity manage on behalf of Group entities?',body:'Any FX exposure arising from permitted underlying commitments belonging to the entities within the same Group.'},
      {ref:'FAQ Q45',title:'Who is eligible for the Dynamic Hedging Framework as a Non-Resident Institutional Entity?',body:'A Non-Resident Institutional Investor that registers with BNM, excluding (a) a Non-Resident bank and (b) a Non-Resident securities company; registration must be undertaken at firm level. A Non-Resident trust bank or custodian bank may also register on behalf of its Non-Resident Institutional Investor clients.'},
      {ref:'FAQ Q46',title:'How does a Non-Resident Institutional Investor register for the Dynamic Hedging Framework?',body:'If not already registered, the Non-Resident Institutional Investor must complete a one-off registration with BNM. The form is available on BNM\'s website, http://bnm.my/fep.'},
      {ref:'FAQ Q47',title:'How does a Non-Resident trust bank or global custodian apply for the Dynamic Hedging Framework?',body:'A Non-Resident trust bank or global custodian may submit an application to undertake dynamic hedging on behalf of its Non-Resident Institutional Investor clients. The form is available on BNM\'s website, http://bnm.my/fep.'},
      {ref:'FAQ Q48',title:'Can a Non-Resident Institutional Investor carve out specific funds for passive hedging during registration?',body:'Yes. During registration, the Non-Resident Institutional Investor must make a one-off declaration of the funds to be used for dynamic hedging. Funds carved out for passive hedging are not eligible for dynamic hedging.'},
      {ref:'FAQ Q49',title:'What hedging instruments are permitted under the Dynamic Hedging Framework for Non-Residents?',body:'Only plain vanilla FX/MYR forward contracts (buying or selling) are permitted as the hedging instrument.'},
      {ref:'FAQ Q50',title:'What underlying assets are eligible for dynamic hedging by a Non-Resident Institutional Investor?',body:'(a) Investment in ringgit-denominated debt securities on the Real-time Electronic Transfer of Funds and Securities System (RENTAS); (b) investment in ringgit-denominated equity securities on Bursa Malaysia; or (c) temporary placement in ringgit deposits or deposit-like securities offered by licensed onshore banks, using ringgit proceeds from the sale of the securities in (a) or (b), for up to 3 months.'},
      {ref:'FAQ Q51',title:'What is the permitted threshold for dynamic hedging by a Non-Resident Institutional Investor?',body:'A Non-Resident Institutional Investor registered with BNM may: (a) enter into forward contracts to sell ringgit against FC up to 100% of its invested underlying Ringgit Asset; (b) enter into forward contracts to buy ringgit against FC up to 25% of its invested underlying Ringgit Asset; or (c) unwind the forward contracts described in (a) and (b).'},
      {ref:'FAQ Q52',title:'What happens if a Non-Resident Institutional Investor breaches the permitted dynamic hedging threshold?',body:'The Non-Resident Institutional Investor must unwind the forward position back to the permitted limit. BNM will advise the permitted timeline for unwinding on a case-by-case basis (within 7 business days); failure to comply may result in BNM reviewing the investor\'s eligibility.'},
      {ref:'FAQ Q53',title:'Can a Non-Resident Institutional Investor apply for additional flexibility beyond the 25% threshold?',body:'Yes. A registered Non-Resident Institutional Investor wishing to enter into forward contracts to buy ringgit against FC beyond the existing 25% threshold may submit an application to BNM via email to investorregister@bnm.gov.my, justifying the need for the additional position.'},
      {ref:'FAQ Q54',title:'Can a Non-Resident Institutional Investor net settle a forward transaction in FC?',body:'Yes, settlement of forward transactions may be done on a gross or net basis.'},
      {ref:'FAQ Q55',title:'Who can a Non-Resident Institutional Investor approach to undertake dynamic hedging?',body:'A registered Non-Resident Institutional Investor may approach a licensed onshore bank or an AOO to undertake dynamic hedging.'},
      {ref:'FAQ Q56',title:'Can a Non-Resident Institutional Investor use its existing Legal Entity Identifier (LEI) to register for dynamic hedging?',body:'Yes, a Non-Resident Institutional Investor should use its existing LEI to register. More information on the LEI is available at https://www.leiroc.org/.'},
      {ref:'FAQ Q57',title:'Can a Non-Resident transact ringgit interest rate derivatives directly with an LOB or via an AOO?',body:'Yes, such ringgit interest rate derivatives may be undertaken with or without an underlying ringgit interest rate exposure. Effective 15 March 2021, Non-Resident banks may trade ringgit-denominated interest rate swaps without an underlying commitment with any licensed onshore bank, including via its AOO. However, any ringgit interest rate derivative embedded with buying and selling of ringgit against FC (for example, a cross-currency interest rate swap) must be undertaken with a Firm underlying commitment.'},
      {ref:'FAQ Q58',title:'Can a Non-Resident settle a ringgit interest rate derivative contract with an LOB or AOO in ringgit or FC?',body:'Yes, settlement with an LOB or AOO may be done in either ringgit or FC, and on a gross or net basis. For settlement in ringgit or FC, an LOB shall use only the reference exchange rate fixed in Malaysia.'},
    ] },
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
      {ref:'Part C, Para 12',title:'Exchanging of Ringgit or Foreign Currency debt (debt swap)',body:'A Resident is allowed to exchange (swap) its existing Ringgit or Foreign Currency debt for another debt, per the Appendix: WITH A LOB — swapping Ringgit debt into FCY debt (with/without delivery of FCY at inception) is treated as FCY Borrowing, and any FCY delivered at inception used for investment in FCY Asset must comply with Notice 3 for a Resident with DRB; swapping FCY debt into Ringgit debt (with/without delivery of Ringgit at inception) is treated as Domestic Ringgit Borrowing — if the original FCY Borrowing was from a Non-Resident, it remains subject to Notice 2 Parts A/B. WITH A NON-RESIDENT — swapping FCY debt into another FCY debt (with/without delivery of FCY at inception) is treated as FCY Borrowing from a Non-Resident, subject to Notice 2 Parts A/B.'},
      {ref:'Part D, Para 13',title:'Non-Resident Individual — Ringgit borrowing',body:'A Non-Resident Individual is allowed to borrow in Ringgit in any amount from: (a) Immediate Family Member; (b) licensed insurer or takaful operator up to cash surrender value of life policy; or (c) employer in Malaysia for use in Malaysia.'},
      {ref:'Part D, Para 14',title:'Non-Resident (excl NRFI) — Ringgit borrowing from Resident for Real Sector Activity',body:'A Non-Resident (excluding a NRFI) is allowed to borrow in Ringgit in any amount from: (a) a Resident to finance Real Sector Activity in Malaysia; or (b) a Resident stockbroker for margin financing on Bursa Malaysia.'},
      {ref:'Part D, Para 16',title:'Non-Resident — Ringgit borrowing from LOB',body:'A Non-Resident is allowed to borrow in Ringgit from a LOB: (a) in any amount for trade financing for settlement of trade in goods/services with a Resident; (b) up to overdraft amount (max 2 business days, no roll-over) to avoid Bursa/RENTAS settlement failure; or (c) up to RM10 million via repurchase or sale buy-back agreement.'},
      {ref:'Part D, Para 17',title:'Non-Resident — FCY borrowing',body:'A Non-Resident is allowed to borrow in Foreign Currency: (a) in any amount from a LOB, Resident Immediate Family Member, or Non-Resident in Malaysia; or (b) up to the limit in Parts A and B of Notice 3 from another Resident.'},
      {ref:'Part F, Para 19',title:'Lending — general permission',body:'A person is allowed to lend in Ringgit or Foreign Currency to a Resident or Non-Resident for any corresponding Borrowing approved in this Notice or otherwise approved in writing by the FEP Authority.'},
      {ref:'Part G, Para 20',title:'LOB — Financial Guarantee (any amount)',body:'A LOB is allowed to: (a) obtain a Financial Guarantee in any amount in Ringgit or FCY for its own account; and (b) give a Financial Guarantee in any amount in Ringgit or FCY on behalf of its banking group or client.'},
      {ref:'Part G, Para 21',title:'Resident guarantor — securing Resident borrowing (any amount)',body:'A Resident guarantor is allowed to give a Financial Guarantee in any amount in Ringgit or FCY to secure any Borrowing obtained by a Resident in Ringgit or FCY as approved in this Notice.'},
      {ref:'Part G, Para 22',title:'Non-bank Resident guarantor — securing Non-Resident borrowing (conditions apply)',body:'A non-bank Resident guarantor may give a Financial Guarantee in any amount to secure a Non-Resident\'s Borrowing, EXCEPT: (a) if the underlying Borrowing is ultimately utilised by the Resident guarantor — deemed as Borrowing by the Resident guarantor, subject to Notice 2 limits; or (b) if Resident has arranged to repay the FCY Borrowing other than under a call-upon in event of default — deemed as investment in FCY Asset, subject to Notice 3 limits.'},
      {ref:'Part G, Para 23',title:'Resident lender — obtaining guarantee from Non-Resident',body:'A Resident lender is allowed to obtain a Financial Guarantee in any amount in FCY or Ringgit from a Non-Resident guarantor to secure a Borrowing obtained by a Resident or Non-Resident borrower. Where the underlying Borrowing obtained by a Resident is approved under this Notice (or otherwise approved in writing by the FEP Authority), the Financial Guarantee securing it is deemed approved.'},
      {ref:'Part G, Para 24',title:'Financial Guarantee — currency of payment',body:'(1) Any payment arising from a Financial Guarantee in Foreign Currency between Residents shall be made in Ringgit — UNLESS the Resident guarantor is: (a) an Entity within the borrower\'s Group; (b) the borrower\'s Direct Shareholder; (c) an Immediate Family Member; or (d) a LOB — in which case payment may be made in Ringgit or Foreign Currency. (2) Any payment arising from a Financial Guarantee made TO a Non-Resident lender shall be in Foreign Currency, EXCEPT a Non-Resident guarantor may pay a Resident lender in Ringgit or FCY for a Ringgit Financial Guarantee securing approved Ringgit Borrowing. (3) Repayment of consequential debt arising from a Financial Guarantee to a Non-Resident guarantor shall only be made in Foreign Currency.'},
      {ref:'Part G, Para 25',title:'Non-Financial Guarantee — any amount',body:'A Resident is allowed to give or obtain a Non-Financial Guarantee (e.g. performance bond, tender bond, guarantee for supply of goods/services, shipping guarantee) in any amount in FCY or Ringgit to/from a Non-Resident.'},
      {ref:'Part G, Para 26',title:'Non-Financial Guarantee — currency of payment',body:'Any payment to a Non-Resident under a Non-Financial Guarantee shall be made in Foreign Currency. HOWEVER, a payment to or from a Non-Resident under a Non-Financial Guarantee in Ringgit FOR USE IN MALAYSIA may be made in Ringgit or Foreign Currency.'},
    ],
    kw:['borrow','borrowing','lend','lending','loan','guarantee','financial guarantee','non-financial guarantee','performance bond','RM10 million','RM100 million','RM1 million','NRFI','SPV','group','direct shareholder','trade financing','real sector','refinance','immediate family','LOB','credit facility','call-upon','covenant to pay','event of default','IFRS9','debt swap','exchange of debt'],
    faqs: [
      {ref:'FAQ Q1',title:'Does a Resident individual need approval to repay FC borrowing from a Non-Resident?',body:'No, as long as the Borrowing was originally obtained in compliance with the prevailing Foreign Exchange Policy (FEP) rules at the time it was taken out.'},
      {ref:'FAQ Q2',title:'Can a Resident individual borrow in Ringgit or FC from immediate family members?',body:'Yes. There is no limit on Ringgit or FCY Borrowing from an Immediate Family Member. "Immediate Family Member" means a legal spouse, parent, legitimate child (including a legally adopted child) or legitimate sibling of the individual.'},
      {ref:'FAQ Q3',title:'How much FC can a Resident individual borrow from a licensed onshore bank or a Non-Resident (other than family)?',body:'A Resident individual may borrow in FCY up to RM10 million equivalent in aggregate from a licensed onshore bank (LOB) or from a Non-Resident who is not an Immediate Family Member.'},
      {ref:'FAQ Q4',title:'Can a Resident individual borrow in Ringgit from a Non-Resident bank, including a Labuan bank?',body:'No, this is not permitted.'},
      {ref:'FAQ Q5',title:'How much Ringgit can a Resident individual borrow from a Non-Resident that is not a NRFI?',body:'A Resident individual may borrow in Ringgit up to RM1 million in aggregate from a Non-Resident that is not a NRFI, provided the funds are used in Malaysia only.'},
      {ref:'FAQ Q6',title:'Is there a limit on FC borrowing for a foreign-owned company incorporated in Malaysia?',body:'A foreign-owned company incorporated in Malaysia is treated as a Resident for FEP purposes. As a Resident entity it may borrow any amount in FCY from: (a) Non-Resident entities within the same Group, excluding a NRFI or a Non-Resident SPV set up solely to obtain FCY Borrowing from any person outside the Resident borrower\'s Group; (b) Resident entities within the same Group; (c) other Residents through the issuance of FC debt securities (e.g. bonds or sukuk); (d) Resident and Non-Resident Direct Shareholders; and (e) licensed onshore banks. In addition, the Resident company may borrow up to RM100 million equivalent in aggregate on a corporate Group basis from other Non-Residents, including via issuance of FC debt securities — this RM100 million cap is calculated on the combined Borrowing of the Resident entity together with other Resident entities in the same Group that have a parent-subsidiary relationship.'},
      {ref:'FAQ Q7',title:'What counts as a Resident entity\'s Group for Borrowing purposes?',body:'A Resident entity\'s Group comprises: (a) its ultimate holding entity; (b) its parent or head office; (c) its branches; (d) subsidiaries in which the Resident entity holds more than 50% of shares; (e) associate companies in which the Resident entity holds between 10% and 50% of shares; or (f) sister companies that share a common shareholder holding at least 10% in both the Resident entity and the sister company.'},
      {ref:'FAQ Q8',title:'How is a SPV defined for Borrowing purposes?',body:'A SPV is an entity established solely for the purpose of obtaining Borrowing. Entities such as investment holding companies that receive dividend income from investee companies, or Treasury Management Centres that provide treasury services in addition to fund-raising activities for the Group, are not treated as a SPV.'},
      {ref:'FAQ Q9',title:'What factors does BNM consider when assessing an application for FC borrowing from abroad?',body:'BNM takes into account, among other things: (a) the nature of the debt and the balance of payments risk; (b) whether the purpose of the Borrowing is to support productive Real Sector Activity with tangible positive spillover effects on the Malaysian economy; and (c) the applicant\'s financial position, past compliance track record, financial capacity and capability, and its risk management capability in managing the Borrowing from abroad exposure.'},
      {ref:'FAQ Q10',title:'Can a Resident entity repay FC borrowing from a Group entity in Ringgit?',body:'Yes, a Resident entity may repay FC Borrowing obtained from a Resident entity within the same Group using Ringgit.'},
      {ref:'FAQ Q11',title:'What source and receipt accounts apply when a Resident entity borrows FC from a Group entity or its Direct Shareholder?',body:'There is no limit where the lender\'s source account is an Investment FCA and the borrower receives the funds into a Trade FCA, Ringgit account or Investment FCA. Where the lender\'s source account is a Trade FCA or Ringgit account and the borrower receives the funds into an Investment FCA, the amount is capped at the borrower\'s Investment FC asset limit. For repayment, there is no limit where the borrower repays from an Investment FCA into the lender\'s Trade FCA, Ringgit account or Investment FCA; however, repayment into the lender\'s Investment FCA from the borrower\'s Investment FCA is only allowed with documentary proof that the original Borrowing was sourced from that same Investment FCA.'},
      {ref:'FAQ Q12',title:'Can a Resident company borrow in Ringgit from a Non-Resident entity in the same Group?',body:'Yes, there is no limit on such Ringgit Borrowing provided it is used to finance Real Sector Activity in Malaysia. This excludes Borrowing from a NRFI or from a Non-Resident SPV used to obtain Borrowing from any person outside the Resident entity\'s Group.'},
      {ref:'FAQ Q13',title:'What qualifies as Real Sector Activity in Malaysia?',body:'Real Sector Activity covers: (a) production or consumption of goods or services in Malaysia, excluding (i) activities in the financial services sector (whether Islamic or otherwise), (ii) the purchase of securities or Islamic securities, or (iii) the purchase of financial instruments or Islamic financial instruments; and (b) construction or purchase of a residential or commercial property, excluding the purchase of land that will not be used for construction or for producing goods or services.'},
      {ref:'FAQ Q14',title:'Can a Resident issue Ringgit debt securities to a Non-Resident?',body:'A Resident is free to issue tradable private debt securities denominated in Ringgit to a Non-Resident. However, the issuance of non-tradable private debt securities in Ringgit remains subject to the FEP rules on Borrowing from Non-Residents.'},
      {ref:'FAQ Q15',title:'If a Resident entity borrows in Ringgit from a Non-Resident, can it repay using FC converted from a Trade FCA on a Forward Basis?',body:'The Resident entity may only convert FC sourced from a Trade FCA into Ringgit on a Spot Basis for this purpose. A Resident is not allowed to convert existing FC funds held in a FCA into Ringgit on a Forward Basis, except where the FC proceeds are received into the FCA earlier than the maturity date of the related FX hedging transaction.'},
      {ref:'FAQ Q16',title:'Can a Resident entity freely issue Ringgit-denominated RPS to a NRFI?',body:'Yes, but the proceeds of such redeemable preference shares (RPS) issuance must only be used in Malaysia.'},
      {ref:'FAQ Q17',title:'What if the proceeds of a Ringgit-denominated RPS issuance to a NRFI are intended for use abroad?',body:'If the proceeds from issuing Ringgit-denominated RPS to a NRFI are not to be used in Malaysia (e.g. to be invested abroad), the Resident entity must obtain prior approval from BNM for the issuance, regardless of the amount involved.'},
      {ref:'FAQ Q18',title:'Can a Resident entity swap an outstanding FC debt obligation into another FC debt obligation?',body:'Yes. A Resident entity may enter into a swap arrangement to convert its outstanding FC debt obligation into another FC debt obligation with a licensed onshore bank or a Non-Resident, subject to the prevailing FEP rules on FC borrowing obtained by a Resident entity.'},
      {ref:'FAQ Q19',title:'Can a Resident entity swap an outstanding Ringgit debt obligation into a FC debt obligation?',body:'Yes, provided the swap is carried out with a licensed onshore bank and complies with the prevailing FEP rules on FC borrowing obtained by a Resident entity. Any FC proceeds arising from the exchange transaction must be used in line with the relevant FE Notices.'},
      {ref:'FAQ Q20',title:'Can a Resident company swap a Ringgit debt obligation into a FC debt obligation with a NRFI?',body:'No, this is not permitted.'},
      {ref:'FAQ Q21',title:'Can a Resident entity borrow in Ringgit from a NRFI?',body:'A Resident entity is free to borrow in Ringgit for use in Malaysia from a NRFI that is either: (a) a Multilateral Development Bank; or (b) a Qualified Development Financial Institution approved by BNM. The list of approved Qualified Development Financial Institutions is published on BNM\'s website (bnm.gov.my/fep).'},
      {ref:'FAQ Q22',title:'How does a Non-Resident Development Financial Institution apply to become a Qualified Development Financial Institution, and what criteria does BNM use?',body:'A Non-Resident Development Financial Institution may apply by submitting the Qualified Development Financial Institution Application Form available on BNM\'s website (bnm.gov.my/fep), and BNM will notify the applicant in writing once the application is approved. Approval is granted where the Development Financial Institution meets these criteria: (a) good governance and a clear mandate; and (b) lending or funds raised in Malaysia will be used only for Real Sector Activity in Malaysia.'},
      {ref:'FAQ Q23',title:'Can a Non-Resident individual borrow in Ringgit from their Non-Resident sibling for any purpose?',body:'Yes. A Non-Resident individual may borrow any amount in Ringgit or FC from a Resident or Non-Resident Immediate Family Member (i.e. spouse, parents, children and siblings) for any purpose.'},
      {ref:'FAQ Q24',title:'Can a Non-Resident individual borrow in Ringgit from a Non-Resident sister-in-law for any purpose?',body:'No. In-laws are not treated as Immediate Family Members, so this Borrowing is not permitted under the Immediate Family Member exemption.'},
      {ref:'FAQ Q25',title:'Can a Non-Resident obtain a Ringgit margin financing facility from a Resident stockbroking company to buy Bursa Malaysia-listed shares?',body:'Yes, this is permitted.'},
      {ref:'FAQ Q26',title:'From which sources can a Non-Resident individual borrow Ringgit in Malaysia for any purpose?',body:'A Non-Resident individual may borrow Ringgit up to any amount from: (i) an Immediate Family Member; (ii) a licensed insurer or licensed takaful operator, in connection with a life insurance policy or family takaful certificate; or (iii) an employer in Malaysia, for domestic use. Separately, a Non-Resident individual may also obtain a credit card or charge card facility from an onshore bank for payment of retail goods or services while abroad.'},
      {ref:'FAQ Q27',title:'Can a Non-Resident (other than a NRFI) borrow in Ringgit to finance Real Sector Activity in Malaysia, including buying property?',body:'Yes. A Non-Resident, excluding a NRFI, may borrow Ringgit up to any amount to finance Real Sector Activity in Malaysia, including the purchase of immovable property — except where the purchase is of land only.'},
      {ref:'FAQ Q28',title:'What Ringgit borrowing exceptions apply for margin financing and for a Multilateral Development Bank or Qualified Development Financial Institution?',body:'Notwithstanding the general Real Sector Activity rule: (i) a Non-Resident is allowed to obtain margin financing from a Resident holding a stockbroking licence under the Capital Markets and Services Act 2007, for products traded on Bursa Malaysia; and (ii) a Multilateral Development Bank or a Qualified Development Financial Institution is allowed to borrow Ringgit for use in Malaysia from a Resident or Non-Resident through the issuance of a Ringgit-denominated debt security.'},
      {ref:'FAQ Q29',title:'On what basis can a Non-Resident borrow Ringgit from a LOB?',body:'A Non-Resident may borrow Ringgit from a LOB: (i) via trade financing, for settlement of trade with a Resident, up to any amount; (ii) via an overdraft facility to avoid settlement failure on the purchase of shares or Ringgit instruments traded on Bursa Malaysia or through RENTAS — this overdraft flexibility may only be used by a Non-Resident custodian bank, stockbroking corporation, trust bank, central securities depository or international securities depository acting on behalf of clients, or by a Non-Resident investor for its own account; or (iii) up to RM10 million in aggregate via a repurchase agreement or sale-and-buy-back agreement. Refer to Notice 2 for further details.'},
      {ref:'FAQ Q30',title:'What activities count as Real Sector Activity for Non-Resident Ringgit borrowing, and what does not?',body:'Real Sector Activity includes use of Borrowing proceeds to ultimately finance a Real Sector Activity in Malaysia, such as refinancing of existing Borrowing, on-lending in Ringgit, direct investment and capital contribution. Non-real sector activities include the provision of financial services in Malaysia, or use of the funds outside Malaysia.'},
      {ref:'FAQ Q31',title:'What is a Qualified Development Financial Institution for Non-Resident borrowing purposes?',body:'A Qualified Development Financial Institution is a Non-Resident Development Financial Institution approved by BNM. The list of approved Qualified Development Financial Institutions is published on BNM\'s website (bnm.gov.my/fep).'},
      {ref:'FAQ Q32',title:'Can a Resident entity or individual freely obtain a Financial Guarantee (FG) from any Non-Resident, including a NRFI?',body:'Yes, there is no approval or registration requirement for a Resident to obtain a Financial Guarantee from any Non-Resident, including a Non-Resident Financial Institution (NRFI).'},
      {ref:'FAQ Q33',title:'Can a Resident freely give a Financial Guarantee on behalf of or in favour of a Non-Resident?',body:'Yes, except for a Financial Guarantee issued to secure: (a) FC Borrowing obtained by a Non-Resident SPV from a Non-Resident entity outside the Resident guarantor\'s Group, or where the underlying Borrowing is ultimately utilised by the Resident guarantor — this is deemed Borrowing by the Resident guarantor, subject to the external borrowing limits under Notice 2 Parts A/B; or (b) FC Borrowing obtained by a Non-Resident where repayment will be made by a Resident other than when the FG is called upon by the lender in the event of default — this is deemed an investment in FC Asset, subject to the Notice 3 limit.'},
      {ref:'FAQ Q34',title:'Is BNM approval required to issue a FG securing FC borrowing by a Non-Resident SPV where the proceeds are used by another Non-Resident entity in the same group?',body:'Yes, approval from BNM is required based on the external borrowing limit under Notice 2, even if the Resident guarantor is not the beneficiary of the FC Borrowing.'},
      {ref:'FAQ Q35',title:'Does a Resident guarantor need BNM approval for changes to an existing registered or approved FG?',body:'No, except for FGs securing FC Borrowing obtained by a Non-Resident SPV from outside the Resident guarantor\'s Group, where the underlying Borrowing is ultimately utilised by the Resident guarantor, or where repayment will be made by a Resident (other than upon a call-upon in the event of default) — in those cases the Resident guarantor must abide by the conditions in the approval letter.'},
      {ref:'FAQ Q36',title:'Does a "Covenant to Pay" clause (where the guarantor must repay/service FC borrowing without an event of default) count as an arrangement to repay the borrowing?',body:'Yes. This is regarded as the Resident having an obligation to repay the FC Borrowing on behalf of the Non-Resident borrower, and is subject to the investment in FC asset limit under Notice 3.'},
      {ref:'FAQ Q37',title:'If a Resident gives a FG to a Non-Resident Group entity (not a SPV) where the borrowing proceeds will be on-lent to another Resident within the group, is BNM approval required?',body:'No, this is freely allowed — UNLESS there is a formal or informal arrangement for the Resident guarantor to service or repay the FC Borrowing other than for an event of default, in which case the FG is subject to the investment in FC asset limit under Notice 3.'},
      {ref:'FAQ Q38',title:'Is a guarantee securing payment of trade in goods (a trade guarantee) deemed a Financial Guarantee?',body:'No, a guarantee to secure payment of trade in goods is deemed as Borrowing, not a Financial Guarantee.'},
      {ref:'FAQ Q39',title:'What qualifies as a "call-upon" of a Financial Guarantee in the event of default?',body:'A "call-upon" of a Financial Guarantee must be initiated by the LENDER in writing to the guarantor. A guarantor may NOT initiate a "call-upon" of a Financial Guarantee.'},
      {ref:'FAQ Q40',title:'Can a Resident guarantor instruct the liquidation of a FG to voluntarily repay the borrowing on behalf of the borrower?',body:'A guarantor may not initiate a "call-upon" of a FG. In the event a guarantor intends to voluntarily liquidate a FG to support the borrower, the guarantor must obtain prior approval from BNM in accordance with Notice 3.'},
      {ref:'FAQ Q41',title:'What is considered an "event of default" for FG rules?',body:'An event of default, prior to a call-upon of a Financial Guarantee by the lender, shall be treated by the lender in accordance with the requirements under IFRS 9 or any equivalent accounting standards adopted by the lender.'},
      {ref:'FAQ Q42',title:'Can a Resident issue or obtain a Non-Financial Guarantee (NFG) in FC to or from another Resident?',body:'Yes, a NFG between Residents is allowed. However, any payment arising from the NFG between the two Residents must be made in Ringgit only.'},
      {ref:'FAQ Q43',title:'Can a Resident pay in Ringgit to a Non-Resident guarantor arising from a called-upon NFG denominated in Ringgit?',body:'Yes, provided the NFG was issued for use in Malaysia and the Ringgit payment is credited into the Non-Resident guarantor\'s External Account. Utilisation of the Ringgit funds in that External Account must comply with Notice 4.'},
    ] },
  3: { id:3, short:'N3', icon:'ti-chart-line', title:'Investment in Foreign Currency Asset',
    desc:'How much Residents may invest abroad — the RM1 million / RM50 million equivalent annual conversion limits and when they apply.',
    secs: [
      {ref:'Part A, Para 1',title:'Resident Individual (no Domestic Ringgit Borrowing) — investment limit UNLIMITED',body:'A Resident Individual, sole proprietorship or General Partnership WITHOUT Domestic Ringgit Borrowing (DRB) is allowed to invest in Foreign Currency Asset up to ANY amount, both onshore and offshore.'},
      {ref:'Part A, Para 2',title:'Resident Individual (WITH Domestic Ringgit Borrowing) — investment limits',body:'A Resident Individual WITH Domestic Ringgit Borrowing may invest in FCY Asset up to: (a) any amount using FCY funds from outside Malaysia (except Export of Goods proceeds) or approved FCY Borrowing under Notice 2; (b) any amount in real estate outside Malaysia for education, employment or migration (own/immediate family accommodation only); or (c) RM1 million equivalent per calendar year from conversion of Ringgit, Trade FCA, or swapping of Ringgit-denominated financial asset. Computed in aggregate including sole proprietorship and General Partnership owned by same individual.'},
      {ref:'Part B, Para 3',title:'Resident Entity (no Domestic Ringgit Borrowing) — investment limit UNLIMITED',body:'A Resident Entity WITHOUT Domestic Ringgit Borrowing is allowed to invest in Foreign Currency Asset up to ANY amount.'},
      {ref:'Part B, Para 4',title:'Resident Entity (WITH Domestic Ringgit Borrowing) — investment limits',body:'A Resident Entity WITH Domestic Ringgit Borrowing may invest in FCY Asset up to: (a) any amount using FCY from outside Malaysia (except Export of Goods proceeds) or approved FCY Borrowing; (b) any amount using LOB FCY Borrowing for Direct Investment Abroad (DIA); or (c) RM50 million equivalent per calendar year from conversion of Ringgit, Trade FCA, LOB FCY Borrowing for non-DIA purposes, or swapping of Ringgit-denominated asset. Computed on parent-subsidiary group basis.'},
      {ref:'Part C, Para 5',title:'LOB, Licensed Insurer, Licensed Takaful Operator — own account UNLIMITED',body:'A LOB, licensed insurer or licensed takaful operator may invest in Foreign Currency Asset up to any amount for its own account.'},
      {ref:'Part C, Para 6',title:'Licensed insurer, takaful operator or SC-licensed Entity — investing Onshore on behalf of clients UNLIMITED',body:'A licensed insurer, a licensed takaful operator, or a Resident Entity authorised, registered or licensed by the Securities Commission Malaysia (including a Resident Entity offering closed-end funds) to undertake investment on behalf of its clients, may invest in Foreign Currency Asset ONSHORE on behalf of its clients up to ANY amount.'},
      {ref:'Part C, Para 7-8',title:'Licensed insurer / takaful operator — investing Offshore on behalf of clients (NAV limits)',body:'A licensed insurer is allowed to invest in Foreign Currency Asset Offshore on behalf of its client up to: (a) the NAV of an investment-linked fund belonging to a client who is a Resident without DRB or a Non-Resident; or (b) 50% of the NAV (computed in aggregate at the licensed insurer\'s level, not per fund) of an investment-linked fund belonging to its Resident client WITH DRB — UNLESS the licensed insurer can ascertain that paragraph 2(a), 2(c)(i)-(ii), 4(a) or 4(c)(i)-(iii) applies, in which case the higher limits under those paragraphs apply instead. A licensed takaful operator is allowed to invest in Foreign Currency Asset Offshore on behalf of its clients up to the NAV of a Shariah-compliant investment-linked fund belonging to its client.'},
      {ref:'Part C, Para 9-10',title:'SC-licensed fund manager — investing Offshore on behalf of clients (NAV limits, with exceptions)',body:'A Resident Entity authorised, registered or licensed by the Securities Commission Malaysia to offer a unit trust scheme or collective investment scheme (including a closed-end fund) is allowed to invest in FCY Asset Offshore on behalf of its client up to: (a) the NAV of funds belonging to a client who is a Resident without DRB or a Non-Resident; (b) the NAV of Shariah-compliant funds belonging to its Resident client; or (c) 50% of the NAV (computed in aggregate at the Resident Entity\'s level, not per fund) of conventional funds belonging to its Resident client WITH DRB — UNLESS the Resident Entity can ascertain that paragraph 2(a), 2(c)(i)-(ii), 4(a) or 4(c)(i)-(iii) applies. (10)(1) A Resident Entity licensed by SC Malaysia to undertake fund management activities is allowed to invest in FCY Asset Offshore on behalf of its client up to: (a) the total funds belonging to a client who is a Resident without DRB or a Non-Resident; (b) the total funds belonging to its Resident client for investment in Shariah-compliant assets; or (c) 50% of the total funds (computed in aggregate at the Resident Entity\'s level) belonging to its Resident client WITH DRB — unless the same exceptions apply. (2) Where decisions on the investment under paragraph 10(1) are made by the Resident CLIENT itself (not the fund manager), Parts A and B of this Notice shall apply directly to that client instead.'},
    ],
    kw:['invest','investment','foreign currency asset','FCY asset','offshore','onshore','domestic ringgit borrowing','DRB','RM1 million','RM50 million','LOB','unit trust','direct investment abroad','DIA','real estate','Trade FCA','unlimited','fund manager','portfolio','securities','investment-linked fund','net asset value','NAV','licensed insurer','takaful operator','closed-end fund','fund management'],
    faqs: [
      {ref:'FAQ Q1',title:'Is a Resident individual without DRB subject to the investment in FC asset limit?',body:'No. A Resident individual without Domestic Ringgit Borrowing (DRB) is free to invest any amount in FC asset onshore and offshore.'},
      {ref:'FAQ Q2',title:'If a Resident individual has DRB, how much can they invest in FC asset onshore and offshore?',body:'A Resident individual with DRB can invest in FC asset onshore and offshore up to RM1 million equivalent in aggregate per calendar year. Note: DRB refers to any borrowing in Ringgit obtained by a Resident from another Resident, excluding one (1) housing loan and one (1) vehicle loan.'},
      {ref:'FAQ Q3',title:'If a Resident individual has more than one housing or vehicle loan, are they deemed to have DRB?',body:'Yes. Having more than one (1) housing loan or one (1) vehicle loan means the Resident individual is deemed as having Domestic Ringgit Borrowing (DRB).'},
      {ref:'FAQ Q4',title:'How does a Resident individual with DRB compute their total investment in FC asset limit?',body:'The investment in FC asset limit is based on the aggregate amount of investment in FC asset onshore and offshore per calendar year undertaken by the Resident individual.'},
      {ref:'FAQ Q5',title:'Can a Resident individual with DRB freely purchase a property abroad for a close friend migrating overseas?',body:'No. A Resident individual may only purchase property abroad for their own account or for immediate family members, and only under the permitted purposes - namely education, employment or migration outside Malaysia.'},
      {ref:'FAQ Q6',title:'What documents are required for a Resident individual to purchase a property abroad for migration purposes?',body:'A Resident individual must produce relevant supporting documents confirming their citizenship or permanent resident status abroad, including conditional approval letters, as part of the onshore bank\'s due diligence process.'},
      {ref:'FAQ Q7',title:'Can a Resident individual with DRB purchase property abroad for a child\'s 10-year education plan without documentation?',body:'No. A Resident individual must submit documentary evidence of a committed education plan (e.g. an enrolment letter from the foreign school or institution) as part of the onshore bank\'s due diligence process.'},
      {ref:'FAQ Q8',title:'Is a Resident subject to an investment limit when purchasing digital assets on a registered DAX in Malaysia?',body:'No. A Resident is free to purchase digital assets on a registered digital asset exchange (DAX) in Malaysia, as long as it is settled in Ringgit.'},
      {ref:'FAQ Q9',title:'Is a Resident subject to an investment limit when transferring digital assets from a registered DAX to an offshore wallet?',body:'Yes. Such a transfer is subject to the applicable investment in FC asset limit under Notice 3 for a Resident with DRB.'},
      {ref:'FAQ Q10',title:'Can a Resident individual invest in derivatives such as options and swaps offered by a Non-Resident?',body:'Yes. A Resident individual may invest in non-exchange rate related derivatives, such as equity options, commodity futures and other similar products offered by a Non-Resident, subject to the permissible limit on investment in FC asset under Notice 3, as long as it is consistent with the individual\'s risk tolerance.'},
      {ref:'FAQ Q11',title:'Can a Resident individual with DRB invest in an FC product embedded with derivatives offered by a Non-Resident?',body:'A Resident individual with DRB may invest up to the prudential limit of RM1 million in aggregate per calendar year, if the investment is sourced from conversion of Ringgit or transfer from a Trade FCA.'},
      {ref:'FAQ Q12',title:'Can a Resident individual purchase derivatives directly from a Non-Resident futures broker or bank?',body:'Yes. A Resident individual may do so subject to the permissible limit on investment in FC asset under Notice 3, as long as the derivative is not an exchange rate derivative.'},
      {ref:'FAQ Q13',title:'How does a Resident individual compute the investment amount for non-exchange rate related derivatives - notional amount or margin?',body:'The investment amount is computed based on the total remittance made to the Resident individual\'s margin account maintained with the Non-Resident broker or Non-Resident bank to facilitate the derivative transactions. If a potential margin call would cause the investment to exceed the RM1 million annual aggregate limit, prior approval from BNM is required. Such applications typically take up to 14 business days from the date full information is received, so this should be factored into risk assessment when investing in derivatives.'},
      {ref:'FAQ Q14',title:'Is a Resident entity without DRB subject to the investment in FC asset limit?',body:'No. A Resident entity without DRB is free to invest any amount in FC asset onshore and offshore.'},
      {ref:'FAQ Q15',title:'How does a Resident entity determine whether it has DRB?',body:'DRB is any borrowing in Ringgit obtained by a Resident from another Resident. A Resident entity is deemed to have DRB when another Resident entity with which it has a parent-subsidiary relationship has DRB. The following are not considered DRB: (a) a borrowing obtained from its Resident Direct Shareholder or another Resident entity with which it has a parent-subsidiary relationship; (b) any credit or financing facility used solely for sundry expenses or employees\' expenses. Sundry expenses refer to small, infrequent expenses for office supplies (e.g. stationery), ancillary services (e.g. software and online subscriptions) and other minor costs of daily business operations. Employees\' expenses refer to business-related costs such as travel (lodging and transportation), entertainment, health, insurance and takaful, excluding investment.'},
      {ref:'FAQ Q16',title:'How does a Resident entity with DRB compute its total investment limit?',body:'The investment limit for a Resident entity takes into account the aggregate amount of investment in FC asset onshore and offshore per calendar year undertaken by the Resident entity together with its Resident Group of entities that have a parent-subsidiary relationship.'},
      {ref:'FAQ Q17',title:'Does a Resident entity need prior BNM approval if its intended investment in FC assets exceeds the RM50 million annual aggregate limit?',body:'Yes, but only the amount exceeding the RM50 million annual aggregate limit requires prior approval from BNM.'},
      {ref:'FAQ Q18',title:'Is a Resident exporter subject to an investment limit when placing FC funds from its Trade FCA into a short-term FC deposit with an onshore bank?',body:'No, provided the short-term FC deposit functions like a Trade FCA and the placed funds are credited back into the Trade FCA strictly upon maturity of the placement, the exporter is not subject to an investment limit.'},
      {ref:'FAQ Q19',title:'Where can a Resident entity place proceeds from investment abroad, such as investment income or dividends?',body:'A Resident entity may place its investment income into either its Trade FCA or Investment FCA.'},
      {ref:'FAQ Q20',title:'Can a Resident entity use income from investment abroad for other investment activities abroad?',body:'Yes. A Resident entity can use investment income received into its Investment FCA for further reinvestment in FC asset.'},
      {ref:'FAQ Q21',title:'Can a Resident entity with DRB purchase property outside Malaysia from a Non-Resident for staff posted abroad?',body:'Yes, subject to the RM50 million annual aggregate limit on investment in FC asset. Any investment in FC asset sourced from a Trade FCA by a Resident entity with DRB is subject to the RM50 million annual aggregate limit, and property outside Malaysia owned by a Non-Resident is deemed to be FC asset offshore.'},
      {ref:'FAQ Q22',title:'How is the investment threshold computed when a Resident Intermediary invests on behalf of a Resident client with DRB?',body:'Under Scenario 1, a Resident Intermediary may invest in conventional FC asset offshore up to 50% of the Net Asset Value (NAV) of total funds combined, while investment in FC asset onshore and in Shariah-compliant FC asset offshore may each go up to 100% of the NAV of total funds. Under Scenario 2, investment in Shariah-compliant FC asset offshore and investment in FC asset onshore may each go up to 100% of the NAV of total funds.'},
      {ref:'FAQ Q23',title:'How does a Single Family Office (SFO) determine whether it has DRB?',body:'An SFO (under the SFO Incentive Scheme led by the Securities Commission Malaysia for the Ministry of Finance) is deemed to have DRB when: (a) the SFO itself has a DRB; and/or (b) another Resident entity with which it has a parent-subsidiary relationship has a DRB; and/or (c) a Resident individual who is the ultimate owner of the SFO has a DRB. The SFO\'s investment limit considers the aggregate amount of investment in FC assets onshore and offshore per calendar year, covering the SFO itself, its Resident Group of entities with a parent-subsidiary relationship, and the Resident individual(s) who are its ultimate owner(s). Effectively, the SFO, the other Resident entities and the Resident individuals share a combined investment limit of RM50 million per calendar year if any member of the group has a DRB.'},
      {ref:'FAQ Q24',title:'Is there any restriction on a Non-Resident investing in Malaysia and repatriating profits or divestment proceeds abroad?',body:'No. A Non-Resident is free to invest in any form of Ringgit Asset in Malaysia, and is also free to repatriate divestment proceeds, profits, dividends or any income arising from these investments in Malaysia, provided it is in Foreign Currency (FC).'},
      {ref:'FAQ Q25',title:'I am a Non-Resident overseas and want to buy Ringgit assets but can\'t access Malaysian financial markets due to time zone differences - can I buy Ringgit from a financial institution in my home country?',body:'Yes. A Non-Resident investor may buy Ringgit against FC from an appointed overseas office (AOO) of a licensed onshore bank to facilitate the purchase of Ringgit Asset. A list of financial institutions under the AOO framework is available at https://bnm.my/fep.'},
      {ref:'FAQ Q26',title:'Can a Non-Resident open a Ringgit account in Malaysia, and are there restrictions on how it can be operated?',body:'Yes. A Non-Resident is free to open a Ringgit account in Malaysia, known as an External Account. Funds in the External Account can be used, among others, to pay for goods or services in Malaysia or to purchase Ringgit Asset in Malaysia. There is also no restriction on a Non-Resident repatriating funds in the External Account upon conversion into FC.'},
      {ref:'FAQ Q27',title:'What Ringgit assets can be settled using funds from a Non-Resident\'s External Account?',body:'Ringgit Asset includes: (a) Ringgit-denominated securities or Islamic securities issued in Malaysia by a Resident; (b) Ringgit-denominated securities or Islamic securities issued by a Non-Resident as approved by BNM; (c) Ringgit-denominated financial instruments or Islamic financial instruments as approved by BNM; or (d) properties in Malaysia.'},
      {ref:'FAQ Q28',title:'Can a Non-Resident invest in Malaysia via an Institutional Investor?',body:'Yes. There is no restriction on a Non-Resident investing in Malaysia via a Non-Resident Institutional Investor.'},
      {ref:'FAQ Q29',title:'Are there flexibilities given to a Non-Resident Institutional Investor arising from investments in Malaysia?',body:'Yes. A Non-Resident Institutional Investor is accorded flexibilities to manage foreign exchange exposure arising from its investments in Malaysia.'},
    ] },
  4: { id:4, short:'N4', icon:'ti-arrows-exchange', title:'Payment and Receipt',
    desc:'Permitted Ringgit and foreign-currency payments between Residents and Non-Residents, repatriation, and FCA / External Accounts.',
    secs: [
      {ref:'Part A, Para 1',title:'Payment for approved transaction — general rule',body:'A person is allowed to make or receive a payment arising from any transaction approved in writing by the FEP Authority under the FEP Notices or otherwise approved by the FEP Authority.'},
      {ref:'Part B, Para 2',title:'Non-Resident — Ringgit payment in Malaysia (permitted purposes)',body:'A Non-Resident is allowed to make or receive payment in Ringgit in Malaysia to/from a Resident or Non-Resident for: (a) any purpose between Immediate Family Members; (b) income earned or expense incurred in Malaysia; or (c) settlement of trade in goods/services, a Ringgit Asset, or commodity murabahah transaction.'},
      {ref:'Part B, Para 3',title:'Non-Resident — Ringgit payment (court judgement, reinsurance)',body:'A Non-Resident is allowed to make/receive Ringgit payment to/from a Resident for: (a) court judgement where underlying transaction complies with FEP Notices; or (b) reinsurance for domestic insurance or retakaful for domestic takaful business.'},
      {ref:'Part C, Para 4',title:'Resident — FCY payment between Residents (permitted purposes)',body:'A Resident may make/receive FCY payment to/from another Resident for: (a) any purpose between Immediate Family Members; (b) education, employment or migration outside Malaysia; (c) transaction with a LOB, licensed international takaful operator; (d) settlement of FCY derivatives on Specified Exchange, commodity murabahah transactions, miscellaneous expenses abroad between Residents, or domestic trade within Global Supply Chain operations in Malaysia (subject to specific conditions).'},
      {ref:'Part C, Para 5',title:'Resident — FCY payment to/from Non-Resident (generally permitted with exceptions)',body:'A Resident is allowed to make/receive FCY payment to/from a Non-Resident for ANY purpose, EXCEPT: (a) FCY-denominated derivatives offered by a Resident (unless approved under Notice 5); (b) derivatives referenced to Ringgit (unless approved); or (c) Exchange Rate Derivative offered by Non-Resident (unless approved under Notice 1).'},
      {ref:'Part C, Para 6',title:'Non-Resident — FCY payment between Non-Residents (any purpose)',body:'A Non-Resident is allowed to make or receive FCY payment in Malaysia to/from another Non-Resident for ANY purpose.'},
      {ref:'Part E, Para 8',title:'Non-Resident — Repatriation of funds from Malaysia',body:'A Non-Resident is allowed to repatriate funds from Malaysia (including income earned and proceeds from divestment of Ringgit Asset), provided that: (a) repatriation is made in Foreign Currency; and (b) conversion of Ringgit into FCY is undertaken per Notice 1 Part B.'},
      {ref:'Part F, Para 9',title:'Non-Resident — External Account (Ringgit account)',body:'A Non-Resident is allowed to open and maintain an External Account (Ringgit account) with a Financial Institution in Malaysia.'},
      {ref:'Part F, Para 14',title:'Resident Individual — Foreign Currency Account (FCA)',body:'A Resident Individual is allowed to open and maintain a FCA with a LOB or NRFI, individually or jointly with another Resident or Non-Resident Individual.'},
      {ref:'Part F, fn. 5 (Para 14)',title:'Joint FCA — accountholder with Domestic Ringgit Borrowing (DRB)',body:'For a joint FCA where any one accountholder is a Resident Individual with Domestic Ringgit Borrowing (DRB), Part A of Notice 3 shall apply.'},
      {ref:'Part F, Para 15',title:'Resident Individual — transfer of FC funds between FCAs',body:'Subject to Part A of Notice 3, a Resident Individual is allowed to transfer Foreign Currency funds from his FCA into: (a) his own FCA; (b) his joint FCA; or (c) a FCA of his Immediate Family Member, opened individually or jointly with any Individual.'},
      {ref:'Part F, Para 16',title:'Resident Entity — Foreign Currency Account',body:'A Resident Entity is allowed to open and maintain a FCA with a LOB or NRFI, subject to Part B of Notice 3 (investment in FCY Asset limits).'},
      {ref:'Part F, Para 18',title:'Non-Resident — Foreign Currency Account',body:'A Non-Resident is allowed to open and maintain a FCA with a LOB, individually or jointly with a Resident Individual or another Non-Resident.'},
    ],
    kw:['payment','receipt','pay','receive','ringgit payment','FCY payment','foreign currency payment','repatriate','repatriation','external account','FCA','trade','goods','services','education','employment','migration','immediate family','remittance','global supply chain','open account','maintain account','joint account','joint FCA','DRB','unit trust','fund manager','commodity derivatives','sugar futures','miscellaneous expense','joint venture','FX contract','money changer','futures broker','commodity murabahah'],
    faqs: [
      {ref:'FAQ Q1',title:'Can a Non-Resident individual make payment in ringgit or FC to his Resident wife for any purpose?',body:'Yes, a Non-Resident individual is allowed to make payment in Ringgit or Foreign Currency to a Resident Immediate Family Member (spouse, parent, child or sibling) for any purpose.'},
      {ref:'FAQ Q2',title:'Does a Non-Resident need an External Account in Malaysia to receive ringgit payment?',body:'Yes.'},
      {ref:'FAQ Q3',title:'Can a Non-Resident with more than one External Account transfer funds between them?',body:'Yes, transferring funds from one External Account to another External Account belonging to the same account holder is allowed.'},
      {ref:'FAQ Q4',title:'Can a Non-Resident transfer funds from their External Account to an Immediate Family Member\'s External Account?',body:'Yes, transferring funds between External Accounts of Non-Residents who are Immediate Family Members (spouse, parents, children and siblings) is allowed.'},
      {ref:'FAQ Q5',title:'Can a Non-Resident convert ringgit into FC with a licensed onshore bank for repatriation abroad?',body:'Yes, a Non-Resident is allowed to repatriate funds from Malaysia — including income earned or proceeds from divestment of a Ringgit Asset — provided the repatriation is made in Foreign Currency.'},
      {ref:'FAQ Q6',title:'Can a Resident individual pay another Resident in foreign currency (FC)?',body:'A Resident individual is free to pay another Resident in FC for: (a) any purpose between Immediate Family Members (spouse, parents, children and siblings); (b) education, employment or migration outside Malaysia; (c) a transaction between the Resident and a LOB, licensed international takaful operator, or international currency unit of a licensed takaful operator in the conduct of the latter\'s FC business; (d) settlement of FC-denominated derivatives (excluding exchange rate derivatives) on a Specified Exchange under the CMSA between the Resident and a Resident futures broker, subject to prevailing investment in FC asset rules; (e) settlement of commodity murabahah transactions between Residents through a commodity trading service provider; and (f) a miscellaneous expense incurred outside Malaysia between a Resident individual residing in Malaysia and a Resident individual residing outside Malaysia. Approval is required for FC payment between Residents for any other purpose. Note: a "miscellaneous expense" is a current account transaction of reasonable amount and infrequent in nature, including holiday expenses abroad, medical expenses abroad, and advance or reimbursement for goods/services purchased abroad on behalf of a Resident individual residing in Malaysia.'},
      {ref:'FAQ Q7',title:'Can a Resident individual travelling overseas pay FC in advance to a friend (a Resident individual residing outside Malaysia) for holiday expenses, or reimburse the friend in FC after the trip?',body:'Yes. A Resident individual residing in Malaysia may make payment in FC to a Resident individual residing outside Malaysia, provided the payment is for a miscellaneous expense to be incurred (or already incurred) outside Malaysia, of reasonable amount and infrequent in nature.'},
      {ref:'FAQ Q8',title:'Can a Resident individual residing outside Malaysia make payment in FC to a Resident individual residing in Malaysia, where the funds are converted into Ringgit upon receipt?',body:'Yes. Where FC funds remitted by a Resident individual residing outside Malaysia to a Resident individual residing in Malaysia are converted into Ringgit upon receipt, such payment is deemed a payment in Ringgit between Residents, not a FC payment.'},
      {ref:'FAQ Q9',title:'Can a Resident make or receive payment in FC for FC-denominated unit trust funds (or other collective investment schemes) offered by a local licensed fund manager?',body:'Yes. As stipulated in Notice 5, a licensed fund manager is allowed to offer unit trust funds (or other equivalent collective investment schemes) denominated in FC to any person. Payments directly linked to the fund — such as subscription, redemption, sales charge, management fees and performance fees — may be made in the base currency of the fund.'},
      {ref:'FAQ Q10',title:'What type of FC receipts from abroad can a Resident individual keep in their FCA?',body:'A Resident individual may keep FC receipts arising from income, profit, rental, proceeds from divestment of FC assets, and approved FC borrowings in their FCA.'},
      {ref:'FAQ Q11',title:'Two Resident companies have been awarded a joint venture project overseas — can they open a FCA to facilitate payments and receipts under this project?',body:'Yes, provided the FCA is opened by the joint venture entity. However, approval is required for other Resident companies to open and maintain a joint FCA.'},
      {ref:'FAQ Q12',title:'I am a Resident individual who maintains a joint FCA (joint fixed deposit) with a Non-Resident individual — how is the conversion limit for investing in this joint FC fixed deposit applied?',body:'Ringgit conversion for joint investment in foreign currency assets is subject to the annual prudential limit of RM1 million in aggregate PER PERSON per annum, so long as one of the parties is a Resident with DRB. Hence, for this joint FCA, the total conversion limit for the joint FC fixed deposit is RM2 million per annum.'},
      {ref:'FAQ Q13',title:'What is the definition of Global Supply Chain for the purpose of settling domestic trade in FC?',body:'Global Supply Chain is defined as a business activity where a Resident importer purchases goods or services from overseas to support production and distribution of goods or services by a Resident exporter for its export activities. This includes domestic trade transactions between the Resident importer and the Resident exporter undertaken through a Resident intermediate entity.'},
      {ref:'FAQ Q14',title:'Does a Resident exporter need BNM approval to be eligible for the Global Supply Chain FC settlement flexibility?',body:'No. The resident entities operating in the Global Supply Chain shall instead provide any supporting documents requested (e.g. a list of Resident vendors) to the licensed onshore bank facilitating the FC payment, as part of the bank\'s due diligence process.'},
      {ref:'FAQ Q15',title:'Can a Resident exporter convert Ringgit into FC to pay another Resident entity under Global Supply Chain arrangements?',body:'No. The Resident exporter can only source the FC payment from available FC funds in its Trade FCA, or from proceeds of an FC trade financing facility — not from converting Ringgit.'},
      {ref:'FAQ Q16',title:'If a Resident entity has no FC obligations and sells locally-sourced goods to a Resident exporter, can it receive FC from the Resident exporter?',body:'No. Such an arrangement is not deemed a Global Supply Chain activity, so the Resident exporter must pay that Resident entity in Ringgit only.'},
      {ref:'FAQ Q17',title:'Can a Resident providing ancillary services (e.g. shipping and logistics) to another Resident that is directly part of a Global Supply Chain settle those services in FC?',body:'Yes, provided the Resident providing the ancillary services has FC obligations incurred overseas arising from its provision of those services, and the Resident payer has FC proceeds available.'},
      {ref:'FAQ Q18',title:'Can a Resident refuse to receive or pay in FC for domestic trade with another Resident that is part of a Global Supply Chain?',body:'Yes. The FC settlement flexibility for Global Supply Chain trade is on a \'willing buyer, willing seller\' basis — neither the Resident payer nor the Resident receiver can force the other to make or receive payment in FC.'},
      {ref:'FAQ Q19',title:'Can a Resident entity enter into FC-denominated commodity derivatives (e.g. sugar futures) directly with Non-Resident counterparties to hedge commodity price risk?',body:'Yes. A Resident entity may undertake commodity derivatives hedging either via a Resident futures broker, or directly with a Non-Resident counterparty, up to the underlying exposure.'},
      {ref:'FAQ Q20',title:'Can a Resident entity trade non-FX FC derivatives with a Non-Resident counterparty for INVESTMENT purposes (not for price hedging)?',body:'Yes, this is permitted within the investment-abroad limit stipulated under Notice 3 (Investment in Foreign Currency Assets).'},
      {ref:'FAQ Q21',title:'Can a Resident entity enter into an FX contract directly with a Non-Resident counterparty?',body:'No. A Resident entity shall only enter into an FX transaction with a licensed onshore bank or a licensed money changer in Malaysia.'},
    ] },
  5: { id:5, short:'N5', icon:'ti-certificate', title:'Securities and Financial Instruments',
    desc:'Issuance and subscription of securities, sukuk, bonds and derivatives by Residents and Non-Residents.',
    secs: [
      {ref:'Part A, Para 1',title:'Resident — issuance of security (Ringgit to NR; FCY to anyone)',body:'A Resident is allowed to issue a security denominated in: (a) Ringgit in Malaysia to a Non-Resident; or (b) Foreign Currency to any person. Where issuance involves a debt security, the Resident issuer shall comply with Notice 2.'},
      {ref:'Part A, Para 2-3',title:'Non-Resident — issuance of security',body:'A Multilateral Development Bank or Qualified DFI may issue a Ringgit debt security in Malaysia to any person (subject to Notice 2). A Non-Resident is allowed to issue a security denominated in Foreign Currency in Malaysia to any person.'},
      {ref:'Part B, Para 4',title:'LOB — issuance of financial instrument',body:'A LOB is allowed to issue or offer a Financial Instrument denominated in: (a) Ringgit in Malaysia to a Non-Resident; or (b) FCY to any person. Where the instrument is referenced to exchange rate, the LOB shall comply with Notice 1.'},
      {ref:'Part B, Para 5',title:'LOB — Ringgit interest rate derivative with Non-Resident',body:'A LOB is allowed to deal in Ringgit-denominated interest rate derivative or profit rate Islamic derivative with a Non-Resident counterparty (directly or via AOO). Where the derivative is an Exchange Rate Derivative or embedded with exchange rate features, Notice 1 must be complied with.'},
      {ref:'Part B, Para 6',title:'Licensed international Islamic bank — Islamic Financial Instrument in FCY',body:'A licensed international Islamic bank is allowed to issue or offer an Islamic Financial Instrument denominated in Foreign Currency to any person. Where the Islamic Financial Instrument is referenced to exchange rate, the licensed international Islamic bank shall comply with Notice 1.'},
      {ref:'Part B, Para 7',title:'Resident licensed insurer / takaful operator — insurance or takaful product linked to Financial Instrument',body:'A Resident licensed insurer or takaful operator is allowed to issue or offer an insurance product or a takaful product linked to a Financial Instrument denominated in Ringgit to a Non-Resident. Note: any insurance or takaful product NOT linked to a Financial Instrument shall be regarded as a SERVICE for the purposes of the FEP Notices.'},
      {ref:'Part B, Para 8',title:'Bursa Malaysia — Ringgit financial instrument to Non-Resident',body:'Bursa Malaysia is allowed to issue or offer to a Non-Resident a Financial Instrument denominated in Ringgit, EXCLUDING a Financial Instrument referenced to exchange rate.'},
      {ref:'Part C, Para 9-10',title:'Subscription or transfer of securities or financial instruments',body:'A Resident or Non-Resident is allowed to subscribe to or transfer a security or Financial Instrument issued per this Notice in Malaysia, subject to compliance with Notice 2, Notice 3 and Notice 4.'},
    ],
    kw:['security','securities','financial instrument','bond','sukuk','share','equity','issue','issuance','derivative','interest rate derivative','Bursa Malaysia','LOB','exchange rate derivative','subscription','transfer','corporate bond','redeemable preference shares','RPS','Islamic bank','Islamic financial instrument','insurance','takaful','insurance product','takaful product'] },
  6: { id:6, short:'N6', icon:'ti-plane-departure', title:'Import and Export of Currency',
    desc:'Carrying cash across the Malaysian border — traveller limits for Ringgit and foreign currency notes, and customs declarations.',
    secs: [
      {ref:'Para 1(1)',title:'Import and export of currency — governed by Gazette Notice G.N. 38691/2013',body:'All importation and exportation of currency shall be made in accordance with the Notice on Import and Export of Currencies, Securities, Islamic Securities, Financial Instruments and Islamic Financial Instruments 2013 [G.N. 38691/2013], effective 2 December 2013.'},
      {ref:'Gazette Notice',title:'Traveller importing Ringgit into Malaysia',body:'A traveller entering Malaysia is allowed to bring in Ringgit currency notes. Import of Ringgit above RM10,000 must be declared to customs upon arrival. Amounts above the declarable threshold brought in without declaration are not permitted.'},
      {ref:'Gazette Notice',title:'Traveller exporting Ringgit out of Malaysia',body:'A traveller leaving Malaysia is allowed to bring out Ringgit currency notes up to RM1,000 per trip only. Export of Ringgit ABOVE RM1,000 is NOT PERMITTED under any circumstances.'},
      {ref:'Gazette Notice',title:'Traveller importing or exporting Foreign Currency',body:'A traveller may bring in or take out Foreign Currency notes. Amounts exceeding RM30,000 equivalent in Foreign Currency must be declared to the Royal Malaysian Customs Department. There is no upper limit on FCY import/export but declaration is mandatory above RM30,000 equivalent. Failure to declare is a violation.'},
      {ref:'Gazette Notice',title:'Non-traveller import/export of currency',body:'Entities (e.g. courier, postal services) importing or exporting currency must comply with Gazette Notice conditions or obtain specific FEP Authority approval. Bulk cash movements by financial institutions follow separate LOB guidelines.'},
    ],
    kw:['import','export','traveller','cash','currency notes','ringgit','carry','bring','border','customs','RM10,000','RM1,000','RM30,000','declaration','declare','physical currency','notes','coins','bulk cash','smuggle'] },
  7: { id:7, short:'N7', icon:'ti-ship', title:'Export of Goods',
    desc:'Export proceeds rules — full value, the 6-month receipt window, approved deductions, offsetting and FEP Authority reporting duties.',
    secs: [
      {ref:'Part A, Para 1(a)',title:'Resident exporter — receipt of export proceeds (currency and account)',body:'A Resident exporter SHALL receive the proceeds of its Export of Goods in Malaysia: in Ringgit or Foreign Currency, placed in a Ringgit account or Trade FCA maintained with a LOB.'},
      {ref:'Part A, Para 1(b)',title:'Resident exporter — receipt in FULL VALUE (approved deductions allowed)',body:'Export proceeds must be received in FULL VALUE excluding: (i) approved deductions (Appendix A): agency commission, advertising/promotion, freight, insurance/takaful, administrative error, exporter discount, quality/quantity claim, short-shipment, shut-out, fraud write-off, value-added-only goods, buyer liquidation; and (ii) approved offsetting/writing-off per Appendix B.'},
      {ref:'Part A, Para 1(c)',title:'Export proceeds timeline — 6 months standard; 24 months for approved circumstances',body:'Export proceeds must be received within the export contract payment date, NOT EXCEEDING SIX (6) MONTHS from date of shipment. EXCEPTION (Appendix C): proceeds may be received up to TWENTY-FOUR (24) MONTHS from shipment where: buyer is in financial difficulties; buyer cancels/disputes/delays/does not respond; FCY restrictions in buyer\'s country; quality/quantity claims; fraud; or credit terms up to 24 months for consignment sales or goods requiring testing and commissioning.'},
      {ref:'Part A, Para 2',title:'Exemption — export proceeds receipt obligation does NOT apply',body:'The receipt obligation does NOT apply (Appendix D) where goods exported under: (a) a border trade agreement between Malaysian Government and foreign government; or (b) goods not for sale: gifts, donations, personal effects, business samples; goods for processing/testing/repair/exhibition/exchange that will be reimported; or goods belonging to Non-Resident exported after exhibition or lease/rental expiry.'},
      {ref:'Part B, Para 3',title:'Non-Resident — permissible sources for Ringgit payment of export proceeds',body:'Where a Non-Resident settles for Export of Goods in Ringgit in Malaysia, Ringgit shall be sourced from: (a) buying Ringgit against FCY per Notice 1 Part B; (b) External Account of the Non-Resident; (c) External Account of NRFI acting on behalf of Non-Resident; or (d) Ringgit trade financing from LOB per Notice 2 Part D.'},
      {ref:'Part C, Para 4',title:'Reporting obligation — large exporters with annual gross Export >RM250M',body:'Where a Resident exporter\'s annual gross Export of Goods exceeds RM250 million equivalent in the preceding year, the Resident exporter shall submit a report to the FEP Authority via https://bnm.my/fep as and when required.'},
      {ref:'Part C, Para 5',title:'Reporting obligation — proceeds not received within 24 months',body:'Where export proceeds are not received within 24 months from the date of shipment, the Resident exporter shall notify the FEP Authority on the outstanding proceeds within TWENTY-ONE (21) DAYS after the end of each calendar year via https://bnm.my/fep.'},
      {ref:'Appendix B',title:'Approved offsetting and writing-off arrangements for export proceeds',body:'A Resident exporter may receive less than full value where it enters into: (a) offsetting arrangement with Non-Resident to offset export proceeds with imports of goods/services by exporter, warranty claims, dividend payments, other Current Account Transactions, or repayment of FCY Borrowing under Notice 2; or (b) writing-off arrangement where Non-Resident buyer is in liquidation, or proceeds cannot be received after at least 24 months from shipment despite following up.'},
    ],
    kw:['export','export proceeds','receipt','payment','shipment','6 months','24 months','RM250 million','reporting','exporter','deduction','freight','insurance','commission','Trade FCA','offsetting','write-off','consignment','border trade','gift','sample','notify BNM','repatriate export'],
    faqs: [
      {ref:'FAQ Q1',title:'What is the scope of "export of goods"?',body:'Export of goods covers: (a) any movement or transfer of goods by land, sea or air from Malaysia to any territory outside Malaysia; or (b) any transfer of ownership in goods originated from Malaysia by a Resident to a Non-Resident abroad, or to a Labuan entity which the FEP Authority has declared a Non-Resident — even where the goods are shipped to another Resident or remain onshore (e.g. in a Non-Resident\'s bonded warehouse).'},
      {ref:'FAQ Q2',title:'Can a Resident exporter retain FC export proceeds overseas?',body:'No. The Resident exporter must repatriate into Malaysia the full value of export of goods proceeds, either in Ringgit or Foreign Currency (FC), within 6 months from the date of shipment. The proceeds can be retained in a Ringgit account or Trade FCA maintained with onshore banks.'},
      {ref:'FAQ Q3',title:'Does repatriation apply to export of services or merchanting trade?',body:'No, the repatriation requirement applies to export of goods only. It does not apply to FC proceeds from export of services or merchanting trade (selling goods to a Non-Resident where the goods are shipped between two overseas locations without entering or leaving Malaysia).'},
      {ref:'FAQ Q4',title:'Are toll manufacturing proceeds treated as export of goods?',body:'Yes. Export proceeds from toll manufacturing performed by a Resident for a Non-Resident (where the Resident receives semi-finished goods from the Non-Resident for further processing and onward selling back to the Non-Resident) are deemed export of goods and subject to the requirements stipulated in Notice 7.'},
      {ref:'FAQ Q5',title:'Is there a timeline to repatriate export proceeds?',body:'Yes. Export proceeds shall be repatriated immediately upon receipt of payment, which must be within 6 months from the date of shipment — so credit terms given to Non-Resident clients cannot exceed 6 months from the shipment date. This timeline can be extended up to 24 months for permitted reasons (see FAQ Q6) without prior approval from the FEP Authority. If proceeds remain outstanding after 24 months from shipment, the Resident exporter must notify the FEP Authority within 21 days after the end of each calendar year via https://bnm.my/fep.'},
      {ref:'FAQ Q6',title:'What are the permitted reasons for the 24-month repatriation extension?',body:'(a) The Resident exporter has no control over the delay in receiving proceeds, including: buyer in financial difficulties; buyer cancels, delays, disputes or does not respond to payment requests; FX restrictions in the buyer\'s country; quality and/or quantity claims; or incidence of fraud. (b) Credit terms of up to 24 months given by the Resident exporter for: consignment sale; or goods that involve testing and commissioning.'},
      {ref:'FAQ Q7',title:'Does this apply to individuals, sole proprietorships and partnerships?',body:'Yes, the export of goods requirements apply to all Residents including individuals, sole proprietorships and general partnerships — other than export of goods by a Resident individual for personal consumption.'},
      {ref:'FAQ Q8',title:'How is the 6-month repatriation period computed?',body:'It is calculated from the date of shipment. Example: invoice dated 5 Feb, shipment dated 5 Mar — if payment is received by 4 Sept (within 6 months of shipment), no approval from the FEP Authority is required. If payment is instead received on 5 Sept (after 6 months) and the delay is not due to a permitted reason, approval from the FEP Authority is required and the application must be submitted before the 6-month period expires.'},
      {ref:'FAQ Q9',title:'Can export proceeds be retained in FC after repatriation?',body:'Yes. A Resident exporter can freely retain any amount of export proceeds in FC in its Trade FCA maintained with a licensed onshore bank, or convert it to Ringgit according to its FC and Ringgit cash-flow needs.'},
      {ref:'FAQ Q10',title:'Is there a time limit on retaining FC proceeds in Trade FCA?',body:'No, there is no time limit on the retention of export proceeds in a Trade FCA.'},
      {ref:'FAQ Q11',title:'What offsetting and writing-off arrangements are approved?',body:'Export proceeds can be offset against the following FC obligations owed to a Non-Resident: (a) import of goods or services; (b) warranty claims; (c) dividend payments; (d) other Current Account Transactions (e.g. management fees); or (e) repayment of FC Borrowing — including global offsetting arrangements undertaken through the Resident exporter\'s Non-Resident treasury management centre (TMC). Export proceeds can also be written off where: (a) the Non-Resident buyer is in liquidation; or (b) the proceeds cannot be received from the Non-Resident buyer at least 24 months from the date of shipment despite following up.'},
      {ref:'FAQ Q12',title:'Can proceeds be offset against anticipated future FC obligations?',body:'No. The offsetting flexibility only applies to incurred FC obligations based on a Firm Commitment. Otherwise, the Resident exporter must repatriate the export proceeds to Malaysia in full value.'},
      {ref:'FAQ Q13',title:'Are supporting documents needed for offsetting?',body:'Yes. Documents are required to substantiate that the export proceeds are being offset only against permitted reasons, subject to the licensed onshore bank\'s due diligence process.'},
      {ref:'FAQ Q14',title:'Can proceeds be offset against overseas investments or direct commodity hedging with a Non-Resident?',body:'No. A Resident exporter is not allowed to offset export proceeds against its investment abroad or against a commodity hedging contract entered directly with a Non-Resident counterparty.'},
      {ref:'FAQ Q15',title:'Can a Resident exporter open multiple Trade FCAs?',body:'Yes, a Resident exporter can open multiple Trade FCAs with onshore banks, subject to each onshore bank\'s own due diligence process.'},
      {ref:'FAQ Q16',title:'What can the retained FC funds be used for?',body:'Retained FC funds can be used, among others, to meet FC obligations such as import payments and FC Borrowing repayments. Using export proceeds for investment in FC assets is subject to the investment in FC asset limit stipulated in Notice 3.'},
      {ref:'FAQ Q17',title:'Can a Resident without export proceeds convert Ringgit to FC for import or borrowing obligations?',body:'Yes, conversion of Ringgit into FC to pay import and Borrowing obligations is allowed.'},
      {ref:'FAQ Q18',title:'Can funds move between Trade FCA and Investment FCA?',body:'Yes, transferring funds from a Trade FCA to an Investment FCA is allowed, subject to the requirements of Notice 3. There is no restriction on transferring funds from an Investment FCA to a Trade FCA, or between accounts of the same type (Trade FCA to Trade FCA, or Investment FCA to Investment FCA) of the same account holder.'},
      {ref:'FAQ Q19',title:'Must a Resident exporter submit reports on exports of goods?',body:'A Resident exporter that meets the requirement in Part C of Notice 7 (e.g. annual gross export exceeding RM250 million) shall submit a report on Export of Goods as and when required by the FEP Authority. If a Resident exporter is required to submit such a report, the requirement will be communicated via a letter from the FEP Authority.'},
      {ref:'FAQ Q20',title:'Can approval applications and notifications be combined?',body:'No. Applications for approval and notifications cannot be combined and must be submitted separately.'},
    ] },
};

const CHUNKS = [];
Object.values(NOTICES).forEach(n => {
  n.secs.forEach(s => CHUNKS.push({ noticeId:n.id, noticeName:n.short, noticeTitle:n.title, ref:s.ref, title:s.title, body:s.body }));
  (n.faqs||[]).forEach(s => CHUNKS.push({ noticeId:n.id, noticeName:n.short, noticeTitle:n.title, ref:s.ref, title:s.title, body:s.body }));
});

/* ━━━ GLOSSARY ━━━ */
const GLOSSARY = {
  'Resident': 'A Malaysian citizen (excluding citizens with permanent residence abroad who reside abroad), a body incorporated in Malaysia, or the Malaysian Government.',
  'Non-Resident': 'Any person other than a Resident — including overseas branches of Malaysian companies and Malaysians with foreign PR residing abroad.',
  'LOB': 'Licensed Onshore Bank — a licensed bank, investment bank or Islamic bank under the FSA / IFSA.',
  'AOO': 'Appointed Overseas Office — an overseas office of a LOB\'s banking group approved by the FEP Authority to facilitate Ringgit transactions for Non-Residents.',
  'NRFI': 'Non-Resident Financial Institution — a Non-Resident entity undertaking financial services.',
  'DRB': 'Domestic Ringgit Borrowing — any Ringgit borrowing obtained by a Resident from another Resident, excluding one (1) housing loan, one (1) vehicle loan, and sundry/employee facilities. A Resident with only one (1) housing loan and/or one (1) vehicle loan (and no other Ringgit borrowing from another Resident) does NOT have DRB. IMPORTANT: having MORE THAN one (1) housing loan OR more than one (1) vehicle loan means the Resident is deemed to HAVE DRB (loses the unlimited-investment exemption and becomes subject to the RM1 million / RM50 million annual limits under Notice 3).',
  'Joint Account': 'Per Notice 4, footnote 5 to Para 14: for a joint FCA where any one accountholder is a Resident Individual with Domestic Ringgit Borrowing (DRB), Part A of Notice 3 shall apply. Per the Resident Payment in FC FAQ: Ringgit conversion for joint investment in foreign currency assets is subject to the annual prudential limit of RM1 million in aggregate per person per annum, so long as one of the parties is a Resident with DRB — hence for this joint FCA, the total conversion limit for the joint FC fixed deposit would be RM2 million per annum.',
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
  'Borrowing': 'Any utilised or unutilised credit/financing facility, trade financing facility (incl. trade guarantee), redeemable preference share, or Corporate Bond or Sukuk — excludes supplier trade credit, Forward Basis credit limits, Financial/Non-Financial Guarantees, operational leases, non-recourse factoring, retail credit/charge cards, and one residential property + one vehicle loan to a Resident Individual.',
  'CMSA': 'Capital Markets and Services Act 2007 — governs securities, derivatives and capital market intermediaries referenced in the FEP Notices.',
  'Corporate Bond or Sukuk': 'A corporate bond or Islamic sukuk as defined under the Securities Commission\'s Guidelines on Issuance of Corporate Bonds and Sukuk to Retail Investors.',
  'Current Account Transaction': 'A transaction involving trade in goods or services, or primary/secondary income (fees, commission, royalty, wages, salary, dividend, profit, interest).',
  'Direct Shareholder': 'A shareholder (Resident or Non-Resident, individual or entity) holding at least 10% effective shareholding in a Resident Entity. Under Notice 2 (Part B, Para 9), a Resident Entity is permitted to borrow Foreign Currency in ANY amount from its Direct Shareholder — e.g. a Direct Shareholder settling the Entity\'s FCY obligation (such as an import payment) directly with a Non-Resident counterparty is treated as a permitted, unlimited FCY loan from the Direct Shareholder to the Entity.',
  'Entity': 'Any corporation, statutory body, local authority, society, co-operative, LLP or other organisation/group of persons (in or outside Malaysia), or the Federal/State Government or any other government.',
  'Exchange Rate Derivatives': 'Derivatives or Islamic derivatives whose market price, value, delivery or payment obligation is derived from, referenced to, or based on an exchange rate.',
  'Export of Goods': 'Movement or transfer of goods by land, sea or air from Malaysia to outside Malaysia, or transfer of ownership of Malaysia-originated goods by a Resident Entity to a Non-Resident outside Malaysia (or to a Labuan Entity declared a Non-Resident).',
  'Financial Account Transaction': 'Any transaction other than a Current Account Transaction, including Borrowing and investment-related transactions.',
  'Financial Guarantee': 'Any guarantee, indemnity or undertaking given to secure repayment of a Borrowing.',
  'Financial Institution': 'A person carrying out financial business regulated under laws administered by the Bank (or otherwise specified by the Bank) — includes a LOB, prescribed DFIA institutions, licensed insurers/takaful operators, MSBA licensees, and approved payment instrument issuers.',
  'Financial Instrument': 'Includes derivatives as defined under section 2(1) of the FSA.',
  'Foreign Currency': 'Currency notes/coins that are legal tender outside Malaysia, any right to receive foreign currency (from a bank balance or a person), or a document/device (e.g. traveller\'s cheque, draft, letter of credit) enabling its holder to obtain foreign currency.',
  'Foreign Currency Asset': 'Collectively, Foreign Currency Asset Offshore and Foreign Currency Asset Onshore.',
  'Foreign Currency Asset Offshore': 'A Malaysia-based asset swapped for one in a Labuan Entity or outside Malaysia, or a Foreign Currency-denominated tangible/intangible asset offered by a Non-Resident, held in/with a Labuan Entity, held outside Malaysia, or taking forms such as Borrowing to a Non-Resident, offshore working capital, certain Financial Instruments/Islamic Financial Instruments, or emission credits — excludes reasonable deposits for education, employment or migration abroad.',
  'Foreign Currency Asset Onshore': 'Deposit in an Investment FCA with a LOB or approved Financial Institution, an instrument issued by a LOB with Foreign Currency delivery at maturity, or Foreign Currency-denominated securities/Financial Instruments issued in Malaysia by a Resident as approved by the Bank (excluding derivatives with Firm Commitment), or onshore-traded emission credits.',
  'FSA': 'Financial Services Act 2013 — the primary legislation under which the FEP Notices are issued (together with the IFSA).',
  'General Partnership': 'A partnership as defined under section 3(1) of the Partnership Act 1961.',
  'Global Supply Chain': 'A business activity where a Resident importer brings in goods/services to support a Resident exporter\'s production or export activities, including domestic trade between the Resident importer and exporter (directly or via a Resident intermediate Entity).',
  'Holding/Parent Entity': 'An Entity that owns more than 50% of the ordinary shares of another Entity.',
  'IFSA': 'Islamic Financial Services Act 2013 — the Islamic-finance counterpart legislation under which the FEP Notices are issued (together with the FSA).',
  'Immediate Family Member': 'An Individual\'s legal spouse, parent, legitimate child (including legally adopted) or legitimate sibling.',
  'Individual': 'A natural person.',
  'Institutional Investor': 'A foreign government, central bank, asset manager, pension fund, insurance company or takaful operator.',
  'Intermediary': 'A management company, trust company, legal firm, stockbroking corporation, asset manager or similar Entity that undertakes investment or fund management on behalf of clients.',
  'Islamic Financial Instrument': 'Includes Islamic derivatives as defined under section 2(1) of the IFSA.',
  'Labuan Entity': 'An Entity created, incorporated, licensed or registered under the Labuan Companies Act 1990, Labuan Trust Act 1996, Labuan Financial Services and Securities Act 2010, Labuan Islamic Financial Services and Securities Act 2010, Labuan Foundations Act 2010, or Labuan Limited Partnerships and LLP Act 2010.',
  'Licensed Money Changer': 'A person licensed under the MSBA to carry on money-changing or wholesale currency business, or its money services business agent.',
  'MSBA': 'Money Services Business Act 2011 — governs licensing of money-changing, remittance and wholesale currency businesses.',
  'Multilateral Development Bank': 'A NRFI, established in or outside Malaysia with sovereign-state membership, that fosters economic and social development in member countries by financing projects, supporting investments or generating capital.',
  'Non-Financial Guarantee': 'Any guarantee, indemnity or undertaking (other than a Financial Guarantee) not given to secure a Borrowing — includes a performance bond, tender bond, guarantee for supply of goods/services, or shipping guarantee.',
  'Parent-Subsidiary Relationship': 'The relationship between a Resident Entity and its direct or indirect Resident Holding/Parent Entity or Resident subsidiary, including a Resident subsidiary of a Non-Resident parent and that subsidiary\'s ultimate Resident Holding/Parent Entity.',
  'Portfolio Investment': 'Tradable debt securities, tradable equity securities representing less than 10% ownership in an investee company (including collective investment schemes), or derivatives/Islamic derivatives (other than Exchange Rate Derivatives) without Firm Commitment.',
  'Qualified Development Financial Institution': 'A NRFI that fosters economic and social development by financing projects, supporting investments or generating capital, and is approved by the Bank as such.',
  'RENTAS': 'Real-time Electronic Transfer of Funds and Securities System — Malaysia\'s interbank funds and securities settlement system.',
  'Ringgit': 'Currency notes or coins that are legal tender in Malaysia, including any right to receive ringgit in a form specified by the Bank.',
  'Ringgit Asset': 'Ringgit-denominated securities issued in Malaysia by a Resident or by a Non-Resident (Bank-approved), Ringgit-denominated Financial Instruments (Bank-approved), Ringgit deposits with a Financial Institution in Malaysia, or any property in Malaysia.',
  'Investment FCA': 'Foreign Currency Account used for holding and managing FCY-denominated investments and surplus funds, as opposed to trade-related receipts and payments (Trade FCA).',
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
      c:{ q:'Will the investment be funded by converting Ringgit (or Trade FCA / swapping Ringgit assets)?', yes:{ type:'warn', t:'Affected — annual conversion limits', d:'With DRB, conversion-funded investment is capped per calendar year: RM1 million equivalent for individuals, RM50 million equivalent for entities on a group basis (N3 Paras 2 & 4). Exceeding the cap needs FEP Authority approval — track it on your Dashboard.' }, no:{ type:'ok', t:'Affected, but generally permitted', d:'Investment funded from FCY earned abroad (except export proceeds) or approved FCY borrowing is allowed in any amount (N3 Paras 2(a) & 4(a)).' } },
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
      b:{ q:'Will payment be received within 6 months of shipment, in full value, into a Ringgit account or Trade FCA in Malaysia?', yes:'c', no:{ type:'warn', t:'Affected — timing/value rules engaged', d:'Proceeds beyond 6 months are only allowed in approved circumstances (up to 24 months — buyer difficulties, disputes, consignment, testing). Proceeds still outstanding after 24 months must be reported to the FEP Authority within 21 days after year-end (N7 Paras 1(c) & 5).' } },
      c:{ q:'Did annual gross exports exceed RM250 million equivalent last year?', yes:{ type:'info', t:'Affected — reporting obligation', d:'Large exporters (>RM250M/year) must submit reports to the FEP Authority via bnm.my/fep as and when required (N7 Para 4). Day-to-day receipts look compliant.' }, no:{ type:'ok', t:'Affected, and compliant pattern', d:'Receiving full value within 6 months into a Ringgit account or Trade FCA with a LOB matches the standard Notice 7 obligations. Keep records of any deductions (Appendix A).' } },
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
/* Notice 3's core DRB-gated investment limits (Part A/B, Para 1-4) are the foundation
   every Notice 3 FAQ assumes the reader already has — but their short, generic wording
   ("ANY amount" / "RM1 million") scores low on BM25 against scenario-style queries, so
   they often lose out to FAQs that mention the query's literal keywords (e.g. "housing
   loan"). Anchor them in whenever Notice 3 is relevant, so the model always sees the
   UNLIMITED (without DRB) and capped (with DRB) provisions side by side. */
const N3_ANCHOR_REFS = ['Part A, Para 1', 'Part A, Para 2', 'Part B, Para 3', 'Part B, Para 4'];
function retrieve(query, noticeFilter='all', k=5) {
  if (!BM25) buildBM25();
  const { N, df, docs, avgdl } = BM25, K1=1.5, B=0.75;
  const qterms = tok(query);
  if (!qterms.length) return CHUNKS.slice(0,k);
  const ranked = CHUNKS.map((c,i) => {
    if (noticeFilter !== 'all' && c.noticeId !== parseInt(noticeFilter)) return { c, s:-1 };
    const { tf, len } = docs[i]; let s = 0;
    qterms.forEach(t => {
      const f = tf[t]||0; if (!f) return;
      const idf = Math.log((N-(df[t]||0)+0.5)/((df[t]||0)+0.5)+1);
      s += idf * (f*(K1+1)) / (f + K1*(1-B+B*len/avgdl));
    });
    return { c, s };
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  const top = ranked.slice(0,k).map(x=>x.c);
  if (top.some(c => c.noticeId === 3)) {
    const anchors = CHUNKS.filter(c => c.noticeId === 3 && N3_ANCHOR_REFS.includes(c.ref) && !top.some(t => t.noticeId === c.noticeId && t.ref === c.ref));
    return [...anchors, ...top];
  }
  return top;
}

/* ━━━ STATE ━━━ */
const DEFAULT_CFG = { provider:'gemini', apiKey:'', model:'gemini-2.5-flash', ollamaUrl:'http://localhost:11434', ollamaModel:'qwen2.5:7b', profile:'both' };
const DEFAULT_LIMITS = [
  { id:'n3i', label:'Individual FCY investment', notice:'Notice 3 · with DRB', limit:1000000, used:0 },
  { id:'n2i', label:'Individual FCY borrowing', notice:'Notice 2 · Part A', limit:10000000, used:0 },
  { id:'n3e', label:'Entity FCY investment', notice:'Notice 3 · group basis', limit:50000000, used:0 },
];
/* which profile each limit tracker belongs to — drives the Dashboard's Individual/Entity/Both filter */
const LIMIT_PROFILE = { n3i:'individual', n2i:'individual', n3e:'entity' };
const DEFAULT_DECLS = [
  { id:1, t:'Export proceeds — Q1 shipment approaching 6-month window', d:'Notice 7 · due 30 Jun 2026', done:false },
  { id:2, t:'Dynamic hedging quarterly position update', d:'Notice 1 · FEP Authority portal', done:false },
];

const ST = {
  tab:'notices',
  cfg: { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem('fep_cfg')||'{}') },
  limits: JSON.parse(localStorage.getItem('fep_limits')||'null') || DEFAULT_LIMITS,
  decls: JSON.parse(localStorage.getItem('fep_decls')||'null') || DEFAULT_DECLS,
  sessions: JSON.parse(localStorage.getItem('fep_sess')||'[]'),
  activity: JSON.parse(localStorage.getItem('fep_activity')||'[]'),
  activityFilter:'all', activitySearch:'',
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

/* ━━━ ACTIVITY / AUDIT LOG ━━━ */
const MAX_ACTIVITY = 50;
const ACTIVITY_ICONS = {
  advisor:'ti-message-dots', analyst:'ti-checkup-list', scan:'ti-scan', pdf:'ti-file-type-pdf',
  limit:'ti-gauge', declaration:'ti-clipboard-check', notice:'ti-book-2', check:'ti-help-hexagon',
};
const ACTIVITY_LABELS = {
  advisor:'Advisor', analyst:'Analyst', scan:'Image scan', pdf:'PDF',
  limit:'Limits', declaration:'Declarations', notice:'Notices', check:'Am I Affected?',
};
function logActivity(type, text) {
  ST.activity.unshift({ id: Date.now()+'_'+Math.random().toString(36).slice(2), ts: Date.now(), type, text });
  if (ST.activity.length > MAX_ACTIVITY) ST.activity = ST.activity.slice(0, MAX_ACTIVITY);
  save('fep_activity', ST.activity);
  if (ST.tab === 'dashboard') renderActivity();
}
function renderActivityFilters() {
  const bar = $('activity-filters'); if (!bar) return;
  const types = [...new Set(ST.activity.map(a => a.type))];
  bar.innerHTML = '';
  if (types.length < 2) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const mkPill = (id, label) => {
    const b = mkEl('button', 'npill'+(ST.activityFilter===id?' on':''), esc(label));
    b.addEventListener('click', () => { ST.activityFilter = id; renderActivity(); });
    return b;
  };
  bar.appendChild(mkPill('all','All'));
  types.forEach(t => bar.appendChild(mkPill(t, ACTIVITY_LABELS[t] || t)));
}
function renderActivity() {
  const ul = $('activity-list'); if (!ul) return;
  renderActivityFilters();
  ul.innerHTML = '';
  let items = ST.activity;
  if (ST.activityFilter !== 'all') items = items.filter(a => a.type === ST.activityFilter);
  const q = ST.activitySearch.trim().toLowerCase();
  if (q) items = items.filter(a => a.text.toLowerCase().includes(q));
  if (!items.length) {
    const msg = ST.activity.length ? 'No activity matches your search or filter.' : 'No activity recorded yet — actions across the app will appear here.';
    ul.appendChild(mkEl('li','activity-empty', msg));
    return;
  }
  items.forEach(a => {
    const li = mkEl('li','activity-item');
    li.innerHTML = `<i class="ti ${ACTIVITY_ICONS[a.type] || 'ti-circle'}"></i>
      <div class="activity-body"><div class="activity-text">${esc(a.text)}</div><div class="activity-ts">${new Date(a.ts).toLocaleString('en-MY')}</div></div>`;
    ul.appendChild(li);
  });
}
function exportActivity() {
  if (!ST.activity.length) return toast('No activity to export');
  const header = 'Timestamp,Type,Description\n';
  const rows = ST.activity.map(a => {
    const ts = new Date(a.ts).toISOString();
    const text = '"' + a.text.replace(/"/g, '""') + '"';
    return `${ts},${a.type},${text}`;
  }).join('\n');
  const blob = new Blob([header + rows], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `fep-compass-activity-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link); link.click(); link.remove();
  URL.revokeObjectURL(url);
  toast('Activity log exported');
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
  return `You are an expert compliance analyst for Malaysia's Foreign Exchange Policy (FEP), assisting Malaysian banking officers. You apply the FEP Notices administered by the national FEP Authority. FEP Notices effective: 1 October 2025.

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
  "nextStep": "The exact next action: which FEP Authority submission/registration/report applies (via https://bnm.my/fep) or 'No filing required' "
}

VERDICT DEFINITIONS:
PERMITTED = explicitly allowed without restriction
NOT_PERMITTED = explicitly prohibited
CONDITIONAL = allowed only under specific conditions (list them)
REQUIRES_APPROVAL = needs prior written approval from the FEP Authority

RULES:
1. Base your answer ONLY on the KEY DEFINITIONS and RETRIEVED KNOWLEDGE BASE above — both are authoritative FEP source material
2. Always cite the specific FEP Notice and paragraph reference (a KEY DEFINITION may itself reference the applicable Notice/Part/Para — cite that)
3. When the transaction amount is in a foreign currency and the applicable threshold is expressed in Ringgit (RM), convert the amount to its approximate RM equivalent using a reasonable current market exchange rate — state the assumed rate as an assumption — before comparing it against the RM threshold
4. State assumptions if the question is ambiguous
5. If not covered in the definitions or knowledge base, say so — never fabricate
6. For complex cases, recommend the official FEP regulatory portal: ${FEP_OFFICIAL_URL}
7. DRB check (apply literally, do not assume): a Resident Individual/Entity has Domestic Ringgit Borrowing (DRB) ONLY if they have (a) MORE THAN one (1) housing loan, OR (b) MORE THAN one (1) vehicle loan, OR (c) any other Ringgit borrowing from another Resident not in the excluded categories (see DRB definition). Holding exactly ONE (1) housing loan and/or exactly ONE (1) vehicle loan, with no other such Ringgit borrowing, does NOT give a Resident DRB — that Resident remains in the "WITHOUT DRB" / unlimited-investment category under Notice 3.
   WORKED EXAMPLE: Person A has no Ringgit borrowing at all -> WITHOUT DRB -> UNLIMITED investment in FC asset (Notice 3 Part A Para 1). Person B has exactly ONE (1) outstanding housing loan and no other Ringgit borrowing from a Resident -> still WITHOUT DRB (one housing loan is excluded from the DRB definition) -> ALSO UNLIMITED investment under Notice 3 Part A Para 1 — do NOT apply the RM1 million limit (Para 2) to Person B, since Para 2 only applies to a Resident Individual WITH DRB.
8. Notice 3 Part A Para 1 (UNLIMITED, applies ONLY to a Resident WITHOUT DRB) and Part A Para 2 (RM1 million/year cap, applies ONLY to a Resident WITH DRB) are MUTUALLY EXCLUSIVE — never merge them into one statement. If EVERY party to the transaction is WITHOUT DRB, the verdict is governed ENTIRELY by Para 1: state their investment is allowed up to ANY amount, do NOT mention "RM1 million" anywhere in the explanation, and do NOT perform or reference an RM1 million comparison for that party. Only a party WITH DRB is subject to Para 2's RM1 million/year cap.
9. ARITHMETIC CHECK: whenever you compare a converted RM amount against a numeric threshold (e.g. RM1 million), explicitly verify the comparison before writing your conclusion: if the converted amount is GREATER than the threshold, the correct word is "EXCEEDS" (not "is within" / "does not exceed"); if it is less than or equal to the threshold, the correct word is "does not exceed" / "is within". Re-check the two numbers digit-by-digit before choosing which word to use — do not state a conclusion that contradicts the numbers you just computed.
10. Return ONLY valid JSON. No markdown, no code fences, no preamble.`;
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

/* lightweight client-side throttle — guards against accidental rapid-fire AI requests */
const AI_COOLDOWN_MS = 2500;
let lastAiCallAt = 0;
function aiCooldownOk() {
  const now = Date.now();
  if (now - lastAiCallAt < AI_COOLDOWN_MS) { toast('Please wait a moment before sending another request'); return false; }
  lastAiCallAt = now;
  return true;
}

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
function verdictCard(data, chunks, isPartial, inputRows) {
  const vc = VCFG[data.verdict] || VCFG.CONDITIONAL;
  const card = mkEl('div','vcard');
  card._printChunks = chunks;
  card._printInputRows = inputRows;
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
  if (data.citation) card.appendChild(mkEl('div','vcite',`<div class="vlabel">FEP Citation</div><div class="vcite-text">${esc(data.citation)}</div>`));
  if (chunks?.length) {
    const srcs = mkEl('div','vsources'); const seen = new Set();
    chunks.forEach(c => { const k = `${c.noticeName} ${c.ref}`; if (!seen.has(k)) { seen.add(k); srcs.appendChild(mkEl('span','vsrc-tag',esc(k))); } });
    card.appendChild(srcs);
  }
  const foot = mkEl('div','vfoot');
  const printBtn = mkEl('button','vprint-btn','<i class="ti ti-printer"></i> Save as PDF');
  printBtn.addEventListener('click', () => printVerdict(card));
  foot.appendChild(printBtn);
  card.appendChild(foot);
  return card;
}
/* render the WHO/WHAT/WHERE/WHY/AMOUNT/CONTEXT (or chat question) for the print area */
function printInputBlock(rows) {
  const w = mkEl('div','print-input');
  w.appendChild(mkEl('div','sec-hdr','Compliance check input'));
  rows.forEach(([label, value]) => w.appendChild(mkEl('div','print-input-row', `<strong>${esc(label)}:</strong> ${esc(value)}`)));
  return w;
}
/* clone a verdict card into the dedicated print area and trigger the browser's print/Save-as-PDF dialog */
function printVerdict(card) {
  const area = $('print-area');
  const clone = card.cloneNode(true);
  clone.querySelectorAll('.vfoot').forEach(el => el.remove());
  area.innerHTML = `<div class="print-head">
    <h1>FEP Compass — Compliance Verdict</h1>
    <p>Generated ${esc(new Date().toLocaleString('en-MY'))} · Educational guidance only — not legal advice. Verify complex cases with the FEP Authority.</p>
  </div>`;
  if (card._printInputRows?.length) area.appendChild(printInputBlock(card._printInputRows));
  area.appendChild(clone);
  if (card._printChunks?.length) area.appendChild(provisionList(card._printChunks, 'Provisions used for this check'));
  document.body.classList.add('printing');
  window.print();
}
window.addEventListener('afterprint', () => document.body.classList.remove('printing'));
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
/* shown when an AI call fails — degrade to a reference-only lookup instead of a bare error */
function aiFallbackBlock(err, chunks) {
  const w = mkEl('div','');
  w.appendChild(mkEl('div','error-msg','<i class="ti ti-wifi-off"></i> AI unavailable: ' + esc(err.message)));
  if (chunks?.length) {
    w.appendChild(mkEl('div','vwarn', 'Showing the most relevant FEP provisions below for reference — review manually or retry once the AI provider is reachable.'));
    w.appendChild(provisionList(chunks, 'Reference results (AI unavailable)'));
  }
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
  const profile = ST.cfg.profile || 'both';
  const limits = profile === 'both' ? ST.limits : ST.limits.filter(L => LIMIT_PROFILE[L.id] === profile);
  if (!limits.length) { wrap.appendChild(mkEl('div','ring-empty','No limit trackers for this profile.')); return; }
  limits.forEach(L => {
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
        logActivity('limit', `Updated ${L.label} to ${fmtRM(v)} (${Math.round(v/L.limit*100)}% of ${fmtRM(L.limit)})`);
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
    li.querySelector('.decl-check').addEventListener('click', () => {
      d.done = !d.done; save('fep_decls', ST.decls); renderDecls();
      logActivity('declaration', `${d.done?'Completed':'Reopened'} declaration: "${d.t}"`);
    });
    li.querySelector('.decl-del').addEventListener('click', () => {
      ST.decls = ST.decls.filter(x=>x.id!==d.id); save('fep_decls', ST.decls); renderDecls();
      logActivity('declaration', `Removed declaration: "${d.t}"`);
    });
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
    logActivity('declaration', `Added declaration: "${t}"`);
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
  renderRings(); renderDecls(); renderActivity();
}
$('activity-clear').addEventListener('click', () => {
  ST.activity = []; save('fep_activity', ST.activity); renderActivity(); toast('Activity log cleared');
});
$('activity-export').addEventListener('click', exportActivity);
$('activity-search').addEventListener('input', e => {
  ST.activitySearch = e.target.value; renderActivity();
});

/* ━━━ NOTICES HUB ━━━ */
function renderNoticeCards() {
  const wrap = $('notices-cards'); wrap.innerHTML = '';
  Object.values(NOTICES).forEach(n => {
    const card = mkEl('article','notice-card');
    card.innerHTML = `
      <div class="nc-top"><div class="nc-num">${n.id}</div><div class="nc-title">${esc(n.title)}</div></div>
      <div class="nc-desc">${esc(n.desc)}</div>
      <div class="nc-meta">${n.secs.length} provisions${n.faqs?.length ? ' · ' + n.faqs.length + ' FAQs' : ''} · effective 1 Oct 2025</div>
      <div class="nc-actions">
        <button class="btn primary act-explore"><i class="ti ti-book-2"></i> Explore</button>
        <button class="btn act-check"><i class="ti ti-help-hexagon"></i> Am I Affected?</button>
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
/* render an accordion of {ref,title,body} entries (provisions or FAQs) into a container */
function renderAccordion(list, container, focusRef) {
  list.forEach(s => {
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
    container.appendChild(prov);
    if (focusRef && s.ref === focusRef) setTimeout(() => { head.click(); prov.scrollIntoView({behavior:'smooth', block:'center'}); }, 250);
  });
}
function openNotice(id, focusRef) {
  const n = NOTICES[id]; if (!n) return;
  ST.modalNotice = id;
  const hasFaqs = n.faqs?.length > 0;
  $('nm-tag').textContent = `NOTICE ${n.id} · ${n.secs.length} PROVISIONS${hasFaqs ? ' · ' + n.faqs.length + ' FAQS' : ''}`;
  $('nm-name').textContent = n.title;
  const body = $('nm-body'); body.innerHTML = '';

  if (hasFaqs) {
    const tabs = mkEl('div','nm-tabs');
    const provBtn = mkEl('button','npill on', `Provisions (${n.secs.length})`);
    const faqBtn = mkEl('button','npill', `FAQs (${n.faqs.length})`);
    tabs.appendChild(provBtn); tabs.appendChild(faqBtn);
    body.appendChild(tabs);

    const provWrap = mkEl('div','nm-panel');
    provWrap.appendChild(mkEl('div','sec-hdr','Tap any provision to expand · dotted terms have definitions'));
    renderAccordion(n.secs, provWrap, focusRef);

    const faqWrap = mkEl('div','nm-panel hidden');
    faqWrap.appendChild(mkEl('div','sec-hdr','Frequently asked questions — tap to expand'));
    renderAccordion(n.faqs, faqWrap, focusRef);

    body.appendChild(provWrap); body.appendChild(faqWrap);

    const showTab = (tab) => {
      provWrap.classList.toggle('hidden', tab !== 'prov');
      faqWrap.classList.toggle('hidden', tab !== 'faq');
      provBtn.classList.toggle('on', tab === 'prov');
      faqBtn.classList.toggle('on', tab === 'faq');
    };
    provBtn.addEventListener('click', () => showTab('prov'));
    faqBtn.addEventListener('click', () => showTab('faq'));
    if (focusRef && n.faqs.some(f => f.ref === focusRef)) showTab('faq');
  } else {
    body.appendChild(mkEl('div','sec-hdr','Tap any provision to expand · dotted terms have definitions'));
    renderAccordion(n.secs, body, focusRef);
  }

  openOverlay('notice-overlay');
  logActivity('notice', `Viewed Notice ${n.short} — ${n.title}`);
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
    logActivity('check', `"Am I Affected?" (Notice ${n.short}) → ${res.t}`);
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
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;  // 12 MB
const MAX_PDF_BYTES = 20 * 1024 * 1024;    // 20 MB

wireDropzone('scan-drop','scan-file', f => {
  if (!f.type.startsWith('image/')) return toast('Please choose an image file');
  if (f.size > MAX_IMAGE_BYTES) return toast('Image is too large — max 12 MB');
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
    logActivity('scan', `Scanned image — ${ents.amounts.length} amount(s) detected${ents.noticeHits.length ? ', touches ' + ents.noticeHits.map(x=>x.n.short).join(', ') : ''}`);
  } catch (err) {
    $('scan-text').textContent = 'OCR failed: ' + err.message + ' (check your internet connection — the OCR engine loads from CDN).';
  } finally {
    btn.disabled = false; prog.classList.add('hidden');
  }
});

/* ━━━ TOOL 2 — PDF reader & validator ━━━ */
wireDropzone('pdf-drop','pdf-file', async f => {
  if (f.type !== 'application/pdf') return toast('Please choose a PDF file');
  if (f.size > MAX_PDF_BYTES) return toast('PDF is too large — max 20 MB');
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
    logActivity('pdf', `Scanned PDF "${f.name}" — ${ents.amounts.length} amount(s) detected${ents.noticeHits.length ? ', touches ' + ents.noticeHits.map(x=>x.n.short).join(', ') : ''}`);
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
  const where = $('af-where').value.trim().slice(0, 80), why = $('af-why').value.trim().slice(0, 160);
  const ccy = $('af-ccy').value, ctx = $('af-ctx').value.trim().slice(0, 1000);
  if (!who || !what) return toast('Please select who is transacting and the transaction type');

  let amt = $('af-amt').value;
  if (amt) {
    const n = Number(amt);
    if (!Number.isFinite(n) || n < 0) return toast('Please enter a valid, non-negative amount');
    amt = Math.min(n, 1e15);
  }

  const parts = [`WHO: ${who}`, `WHAT: ${what}`];
  if (where) parts.push(`WHERE: ${where}`);
  if (why) parts.push(`WHY: ${why}`);
  if (amt) parts.push(`AMOUNT: ${ccy} ${Number(amt).toLocaleString()}`);
  if (ctx) parts.push(`CONTEXT: ${ctx}`);
  if (ST.analystImport) parts.push(`DOCUMENT EXTRACT (${ST.analystImport.source}): ${ST.analystImport.excerpt}`);
  const query = parts.join('\n');

  const inputRows = [['Who is transacting', who], ['Transaction type', what]];
  if (where) inputRows.push(['Where', where]);
  if (why) inputRows.push(['Why', why]);
  if (amt) inputRows.push(['Amount', `${ccy} ${Number(amt).toLocaleString()}`]);
  if (ctx) inputRows.push(['Additional context', ctx]);
  if (ST.analystImport) inputRows.push([`Document extract (${ST.analystImport.source})`, ST.analystImport.excerpt]);

  const out = $('analyst-out'); out.innerHTML = '';
  out.appendChild(mkEl('div','sec-hdr','Compliance health-check'));
  const chunks = retrieve(`${who} ${what} ${why} ${ctx}`, 'all', 6);

  if (!aiConfigured()) {
    out.appendChild(mkEl('div','error-msg','No AI provider configured — showing a reference lookup instead. Add a Gemini key or enable Ollama in Settings for full AI verdicts.'));
    out.appendChild(provisionList(chunks));
    return;
  }
  if (!aiCooldownOk()) return;
  const load = mkEl('div','loading','<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
  out.appendChild(load);
  $('analyst-run').disabled = true;
  try {
    const raw = await callAI(query, chunks, []);
    load.remove();
    const p = parseResp(raw);
    if (p.ok) out.appendChild(verdictCard(p.data, chunks, p.partial, inputRows));
    else out.appendChild(rawCard(p.raw));
    out.appendChild(provisionList(chunks, 'Provisions used for this check'));
    logActivity('analyst', `Compliance check: ${who} — ${what} → ${p.ok ? (VCFG[p.data.verdict]?.label || p.data.verdict) : 'unparsed response'}`);
  } catch (err) {
    load.remove();
    out.appendChild(aiFallbackBlock(err, chunks));
    logActivity('analyst', `Compliance check: ${who} — ${what} → AI unavailable, showed reference provisions`);
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
     <p>Describe the transaction — <strong>who</strong> is transacting, <strong>what</strong> they're doing, <strong>where</strong>, <strong>why</strong> and the <strong>amount</strong>. You'll get a structured verdict with FEP citations.</p>`);
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
  const q = inp.value.trim().slice(0, 600);
  if (!q || ST.loading) return;
  if (!aiConfigured()) { toast('Configure an AI provider in Settings first'); switchTab('settings'); return; }
  if (!aiCooldownOk()) return;
  if (!ST.msgs.length) $('msgs').innerHTML = '';
  inp.value = ''; $('send-btn').disabled = true;
  pushUserMsg(q);
  ST.msgs.push({ role:'user', content:q });
  const m = $('msgs');
  const load = mkEl('div','loading','<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
  m.appendChild(load); m.scrollTop = m.scrollHeight;
  ST.loading = true;
  const chunks = retrieve(q, ST.advisorFilter, 5);
  try {
    const raw = await callAI(q, chunks, ST.msgs.slice(0,-1));
    load.remove();
    const wrap = mkEl('div','msg-ai');
    const p = parseResp(raw);
    if (p.ok) { wrap.appendChild(verdictCard(p.data, chunks, p.partial, [['Question', q]])); ST.msgs.push({ role:'assistant', content: JSON.stringify(p.data) }); }
    else { wrap.appendChild(rawCard(p.raw)); ST.msgs.push({ role:'assistant', content: raw }); }
    m.appendChild(wrap);
    logActivity('advisor', `Advisor query: "${q.slice(0,70)}${q.length>70?'…':''}" → ${p.ok ? (VCFG[p.data.verdict]?.label || p.data.verdict) : 'unparsed response'}`);
    // persist session
    const sess = ST.sessions.find(s => s.id === ST.sessId);
    if (sess) { sess.msgs = ST.msgs; sess.q = ST.msgs[0].content; }
    else ST.sessions.unshift({ id: ST.sessId, q, ts: Date.now(), msgs: ST.msgs });
    ST.sessions = ST.sessions.slice(0, 30);
    save('fep_sess', ST.sessions);
  } catch (err) {
    load.remove();
    const wrap = mkEl('div','msg-ai');
    wrap.appendChild(aiFallbackBlock(err, chunks));
    m.appendChild(wrap);
    logActivity('advisor', `Advisor query: "${q.slice(0,70)}${q.length>70?'…':''}" → AI unavailable, showed reference provisions`);
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

  const profileCard = mkEl('div','card');
  profileCard.innerHTML = `<div class="card-head"><h2><i class="ti ti-users"></i> Profile</h2></div>
  <p class="card-hint" style="margin-bottom:12px">Choose which FEP limit trackers appear on your Dashboard — this does not change AI Advisor or Compliance Analyst answers.</p>
  <div class="provider-opts profile-opts">
    <button class="popt ${c.profile==='individual'?'on':''}" data-pr="individual"><span class="popt-id">Individual</span><span class="popt-note">Personal FCY limits — Notices 2 &amp; 3</span></button>
    <button class="popt ${c.profile==='entity'?'on':''}" data-pr="entity"><span class="popt-id">Entity</span><span class="popt-note">Company / group FCY limits — Notice 3</span></button>
    <button class="popt ${c.profile==='both'?'on':''}" data-pr="both"><span class="popt-id">Both</span><span class="popt-note">Show all limit trackers</span></button>
  </div>`;
  el.appendChild(profileCard);
  profileCard.querySelectorAll('.popt').forEach(b => b.addEventListener('click', () => {
    c.profile = b.dataset.pr; save('fep_cfg', c);
    profileCard.querySelectorAll('.popt').forEach(x => x.classList.toggle('on', x.dataset.pr === c.profile));
    renderRings();
    toast(`Profile set to ${b.querySelector('.popt-id').textContent}`);
  }));

  const sec = mkEl('div','card'); sec.style.marginTop = '16px';
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
    Official source: <a href="${FEP_OFFICIAL_URL}" target="_blank" rel="noopener">bnm.gov.my/fep/policies/notices</a></p>
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
    ['fep_cfg','fep_sess','fep_limits','fep_decls','fep_activity','fep_onboarded'].forEach(k => localStorage.removeItem(k));
    location.reload();
  });
}

/* ━━━ ONBOARDING (first-run walkthrough) ━━━ */
const ONBOARDING_KEY = 'fep_onboarded';
function initOnboarding() {
  if (localStorage.getItem(ONBOARDING_KEY)) return;
  const card = $('onboarding-card');
  card.classList.remove('hidden');
  card.querySelectorAll('.onboarding-step').forEach(b => b.addEventListener('click', () => {
    const step = b.dataset.step;
    if (step === 'explore') openNotice(1);
    else if (step === 'check') openQuickCheck(1);
    else if (step === 'settings') switchTab('settings');
    dismissOnboarding();
  }));
  $('onboarding-dismiss').addEventListener('click', dismissOnboarding);
}
function dismissOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, '1');
  $('onboarding-card').classList.add('hidden');
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
initOnboarding();
