export interface UnanetCompany {
    CompanyId: number;
    Name: string;
    Acronym: string;
    Website: string;
    ExternalId: string;
    FPISImportId: string;
    ParentCompanyName: string;
    TickerSymbol: string;
    SalesTarget: number;
    AnnualRevenue: number;
    NumberOfEmployees: number;
    IsHeadquarters: boolean;
    ContactFirmsShortText1: string;
    ContactFirmsShortText2: string;
    ContactFirmsShortText3: string;
    ContactFirmsShortText4: string;
    ContactFirmsShortText5: string;
    ContactFirmsLongText1: string;
    ContactFirmsLongText2: string;
    ContactFirmsLongText3: string;
    ContactFirmsLongText4: string;
    ContactFirmsLongText5: string;
    ContactFirmsNumber1: number;
    ContactFirmsNumber2: number;
    ContactFirmsNumber3: number;
    ContactFirmsNumber4: number;
    ContactFirmsNumber5: number;
    ContactFirmsDate1: string;
    ContactFirmsDate2: string;
    ContactFirmsDate3: string;
    ContactFirmsDate4: string;
    ContactFirmsDate5: string;
    ContactFirmsValueListID1: number;
    ContactFirmsValueListID2: number;
    ContactFirmsValueListID3: number;
    ContactFirmsValueListID4: number;
    ContactFirmsValueListID5: number;
    ContactFirmsMoney1: number;
    ContactFirmsMoney2: number;
    ContactFirmsMoney3: number;
    ContactFirmsMoney4: number;
    ContactFirmsMoney5: number;
    ContactFirmsPercent1: number;
    ContactFirmsPercent2: number;
    ContactFirmsPercent3: number;
    ContactFirmsPercent4: number;
    ContactFirmsPercent5: number;
    DUNSNumber: string;
    OtherCompanyName: string;
    Division: string;
    IsDeleted: boolean;
    Notes: string;
    CreateDateTime: string;
    CreatedByUserId: number;
    LastModifiedDateTime: string;
    LastModifiedByUserId: number;
    LastDeletedDateTime: string;
    LastDeletedByUserId: number;
    ParentCompanyId: number;
    Services: string;
    Sector: string;
    ROW_VERSION: string;
    version_userName: string;
    version_device: string;
    AddrLat: number;
    AddrLong: number;
    isConfidential: boolean;
}

export type CreateUnanetOpportunity = Partial<UnanetOpportunity> & Pick<UnanetOpportunity, 'ClientId' | 'ClientName' | 'OpportunityName' | 'Stage' | 'StageId'>;

export interface UnanetOpportunity {
    OpportunityId: number;
    ClientId: number;
    ClientName: string;
    SF255Form: number;
    SF330Form: number;
    OpportunityName: string;
    EstimatedSelectionDate: Date;
    CloseDate: Date;
    Cost: number;
    Size: number;
    SizeUnit: string;
    Fee: number;
    Probability: number;
    NextAction: string;
    RFPRecieved: boolean;
    ProposalNumber: string;
    ProposalDueDate: Date;
    ExpectedRFPDate: Date;
    QualsDueDate: Date;
    ProposalSubmitted: boolean;
    PresentationDate: Date;
    Comments: string;
    MarketingCostBudget: number;
    MarketingCostActual: number;
    OpportunityNumber: string;
    ActiveInd: number;
    DeleteRecord: boolean;
    Address1: string;
    Address2: string;
    City: string;
    State: string;
    PostalCode: string;
    Country: string;
    OpportunityDescription: string;
    ExternalId: string;
    OpportunityShortText1: string;
    OpportunityShortText2: string;
    OpportunityShortText3: string;
    OpportunityShortText4: string;
    OpportunityShortText5: string;
    OpportunityNumber1: number;
    OpportunityNumber2: number;
    OpportunityNumber3: number;
    OpportunityNumber4: number;
    OpportunityNumber5: number;
    OpportunityDate1: Date;
    OpportunityDate2: Date;
    OpportunityDate3: Date;
    OpportunityDate4: Date;
    OpportunityDate5: Date;
    OpportunityValueListID1: number;
    OpportunityValueListID2: number;
    OpportunityValueListID3: number;
    OpportunityValueListID4: number;
    OpportunityValueListID5: number;
    OpportunityMoney1: number;
    OpportunityMoney2: number;
    OpportunityMoney3: number;
    OpportunityMoney4: number;
    OpportunityMoney5: number;
    OpportunityPercent1: number;
    OpportunityPercent2: number;
    OpportunityPercent3: number;
    OpportunityPercent4: number;
    OpportunityPercent5: number;
    EstimatedStartDate: Date;
    EstimatedCompletionDate: Date;
    FirmFee: number;
    ProjectProbability: number;
    OwnerId: number;
    OwnerName: string;
    TeamOppFirmOrgFeeSource: number;
    OppType: number;
    PreConStartDate: Date;
    PreConEndDate: Date;
    DesignStartDate: Date;
    DesignCompletionDate: Date;
    ConstructionStartDate: Date;
    ConstructionCompletionDate: Date;
    fundProbability: number;
    ShortListed: boolean;
    Interviewed: boolean;
    ShortListedDate: Date;
    Score: number;
    CreateDateTime: Date;
    CreatedByUserId: number;
    LastModifiedDateTime: Date;
    LastModifiedByUserId: number;
    LastDeletedDateTime: Date;
    LastDeletedByUserId: number;
    EstimatedFeePercentage: number;
    FactoredFee: number;
    GrossRevenueSTD: number;
    GrossMarginDollarsSTD: number;
    GrossMarginPercentSTD: number;
    FactoredCostSTD: number;
    FeeCIPercent: number;
    FeeCIDifVolume: number;
    LaborDifferentialDollars: number;
    OppSelfPerformHours: number;
    EstimatedManagementUnits: number;
    GrossMargin: number;
    GrossMarginPercent: number;
    MasterOpportunityId: number;
    OppTypeDescription: string;
    AutoNumber: number;
    Stage: string;
    StageType: string;
    Note: string;
    RedZoneScore: number;
    OpportunityLongText1: string;
    OpportunityLongText2: string;
    OpportunityLongText3: string;
    OpportunityLongText4: string;
    OpportunityLongText5: string;
    approvalLevel: string;
    approvalStatus: string;
    OppLat: number;
    OppLong: number;
    StageId: number;
    County: string;
    RegionId: number;
    WorkHoursEngineer: number;
    WorkHoursConstruction: number;
    WorkHoursDesign: number;
    FeePercent: number;
    SolicitationNumber: string;
    OnCallContractStartDate: Date;
    OnCallContractEndDate: Date;
    OriginalFirmEstimatedFee: number;
    OppFormID: number;
    Markup: number;
    PropertyId: number;
    ReferredByID: number;
    Contacts: object[];
    Region: object[];
    primarycategories: object[];
    secondarycategories: object[];
    Offices: object[];
    Divisions: object[];
    Studios: object[];
    PracticeAreas: object[];
    Territories: object[];
    OfficeDivision: object[];
    servicetypes: object[];
    SubmittalType: object;
    ProspectType: object[];
    StaffTeam: object[];
    Role: object;
    Sf330ProfileCode: object;
    DeliveryMethod: object[];
    servicefeebreakdown: object;
    clienttypes: object[];
    Companies: object[];
    Documents: object[];
    Emails: object[];
    Competition: object[];
    ClonedFrom: object;
}

export interface UnanetLead {
    LeadId?: number;
    Name: string;
    Description?: string;
    NextAction?: string;
    Date?: string;
    TickDate?: string;
    CreateDate?: string;
    IsDeleted?: boolean;
    Email?: string;
    Phone?: string;
    ContactFirst?: string;
    ContactLast?: string;
    NumOfViews?: number;
    EstimatedCost?: number;
    State?: string;
    City?: string;
    Country?: string;
    BidDate?: string;
    LegacyId?: string;
    ModifyDate?: string;
    Deliverable?: string;
    Notes?: string;
    ROW_VERSION?: Uint8Array;
    CreatedByUserId?: number;
    ModifiedByUserId?: number;
    SolicitationNumber?: string;
    UnitSize?: string;
    EstimatedSize?: number;
    StageId?: number;
    StageName?: string;
    StageTypeId?: number;
    StageTypeName?: string;
    AssignedTo?: any[];
    AssociatedCompanies?: any[];
    ContractTypes?: any[];
    Offices?: any[];
    OfficeDivisions?: any[];
    Divisions?: any[];
    Studios?: any[];
    PracticeAreas?: any[];
    Territories?: any[];
    PrimaryCategories?: any[];
    riskprofile?: any;
    LeadTypes?: any[];
    score?: any;
    SecondaryCategories?: any[];
    ServiceTypes?: any[];
    Source?: any[];
    stage?: any;
    recordsource?: any[];
    Opportunity?: UnanetOpportunity[][];
    AssociatedContacts?: any[];
    PotentialClient?: any;
    Naics?: any[];
}

export interface UnanetStage {
    StageID: number;
    StageName: string;
    StageType: {
        StageTypeID: number;
        StageTypeName: string;
    };
}