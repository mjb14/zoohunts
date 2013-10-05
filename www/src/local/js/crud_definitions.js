var EAS = EAS || {};
EAS.crud = EAS.crud || angular.module('services.crud', ['ngResource']);

// NOTE: this is going to be auto-generated
EAS.crud.factory('Entity', [ '$resource', function($resource){
	return {
		access_cntl_affils: $resource('meta/app_security/access_cntl_affils', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		access_cntl_affils: $resource('app_security/access_cntl_affils/:access_cntl_affil_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					access_cntl_affil_id: '@access_cntl_affil_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					idm_ub_affiliation_id: '@idm_ub_affiliation_id',
					app_access_point_id: '@app_access_point_id'
				}
			},
			update: {
				method: 'PUT',
				params: {
					access_cntl_affil_id: '@access_cntl_affil_id',
					idm_ub_affiliation_id: '@idm_ub_affiliation_id',
					app_access_point_id: '@app_access_point_id'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					access_cntl_affil_id: '@access_cntl_affil_id'
				}
			}
		}),
		access_cntl_groups: $resource('meta/app_security/access_cntl_groups', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		
		access_cntl_groups_lookup: $resource('app_security/access_cntl_groups', {}, {
			get: {
				method: 'GET',
				params: {
					idm_group_id: '@idm_group_id',
					app_access_point_id: '@app_access_point_id'
				},
				isArray: false
			}
		}),
		
		access_cntl_groups: $resource('app_security/access_cntl_groups/:access_cntl_group_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					access_cntl_group_id: '@access_cntl_group_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					idm_group_id: '@idm_group_id',
					app_access_point_id: '@app_access_point_id'
				}
			},
			update: {
				method: 'PUT',
				params: {
					access_cntl_group_id: '@access_cntl_group_id',
					idm_group_id: '@idm_group_id',
					app_access_point_id: '@app_access_point_id'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					access_cntl_group_id: '@access_cntl_group_id'
				}
			}
		}),	
		app_access_points_meta: $resource('meta/app_security/app_access_points', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		
		app_access_points_lookup: $resource('app_security/app_access_points/', {}, {
			get: {
				method: 'GET',
				params: {
					application_id: '@application_id',
					access_point_type_id: '@access_point_type',
					access_point_function_id: '@access_point_function_id'
				},
				isArray: false
			}
        }),
		
		app_access_points: $resource('app_security/app_access_points/:app_access_point_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					app_access_point_id: '@app_access_point_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					access_point_function_name: '@access_point_function_name',
					application_id: '@application_id',
					access_point_type_id: '@access_point_type_id',
					access_point_function_id: '@access_point_function_id',
					app_access_point: '@app_access_point',
					descr: '@descr',
					active: '@active'
				}
			},
			update: {
				method: 'PUT',
				params: {
					app_access_point_id: '@app_access_point_id',
					application_id: '@application_id',
					access_point_type_id: '@access_point_type_id',
					access_point_function_id: '@access_point_function_id',
					app_access_point: '@app_access_point',
					descr: '@descr',
					active: '@active'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					app_access_point_id: '@app_access_point_id'
				}
			}
		}),
		access_point_functions_meta: $resource('meta/app_security/access_point_functions', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		access_point_functions: $resource('app_security/access_point_functions/:access_point_function_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					access_point_function_id: '@access_point_function_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					access_point_function_name: '@access_point_function_name',
					descr: '@descr',
					active: '@active'
				}
			},
			update: {
				method: 'PUT',
				params: {
					access_point_function_id: '@access_point_function_id',
					access_point_function_name: '@access_point_function_name',
					descr: '@descr',
					active: '@active'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					access_point_function_id: '@access_point_function_id'
				}
			}
		}),
		access_point_types_meta: $resource('meta/app_security/access_point_types', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		access_point_types: $resource('app_security/access_point_types/:access_point_type_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					access_point_type_id: '@access_point_type_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					access_point_type: '@access_point_type',
					descr: '@descr',
					active: '@active'
				}
			},
			update: {
				method: 'PUT',
				params: {
					access_point_type_id: '@access_point_type_id',
					access_point_type: '@access_point_type',
					descr: '@descr',
					active: '@active'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					access_point_type_id: '@access_point_type_id'
				}
			}
		}),
		applications_meta: $resource('meta/app_security/applications', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		applications: $resource('app_security/applications/:application_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					application_id: '@application_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					application_name: '@application_name',
					descr: '@descr',
					active: '@active'
				}
			},
			update: {
				method: 'PUT',
				params: {
					application_id: '@application_id',
					application_name: '@application_name',
					descr: '@descr',
					active: '@active'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					application_id: '@application_id'
				}
			}
		}),
		groups_meta: $resource('meta/idm/groups', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		groups: $resource('idm/groups/:group_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					group_id: '@group_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					group_name: '@group_name'
				}
			},
			update: {
				method: 'PUT',
				params: {
					group_id: '@group_id',
					group_name: '@group_name'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					group_id: '@group_id'
				}
			}
		}),
		ldap_group_lookup: $resource('idm/groups/', {}, {
			get: {
				method: 'GET',
				params: {
					group_name: '@group_name'
				},
				isArray: false
			}
		}),
		ub_affiliations_meta: $resource('meta/idm/ub_affiliations', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		}),
		ub_affiliations: $resource('idm/ub_affiliations/:ub_affiliation_id', {}, {
			query: {
				method: 'GET',
				isArray: false
			},
			get: {
				method: 'GET',
				params: {
					ub_affiliation_id: '@ub_affiliation_id'
				},
				isArray: false
			},
			create: {
				method: 'POST',
				params: {
					ub_affiliation: '@ub_affiliation'
				}
			},
			update: {
				method: 'PUT',
				params: {
					ub_affiliation_id: '@ub_affiliation_id',
					ub_affiliation: '@ub_affiliation'
				}
			},
			obliterate: {
				method: 'DELETE',
				params: {
					ub_affiliation_id: '@ub_affiliation_id'
				}
			}
		})
	};
}]);
